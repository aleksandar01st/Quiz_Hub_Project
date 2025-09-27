import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getQuestionsByQuizId,
  getQuizById,
} from "../service/QuizDetailsService";
import "./TakeQuiz.css";
import { saveResult, SaveResultDto } from "../service/ResultService";
import { Question, Quiz } from "../helper/TakeQuiz";

const TakeQuiz: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<{
    [key: number]: string | number | number[];
  }>({});
  const [timeLeft, setTimeLeft] = useState(0); // sekunde
  const [elapsedTime, setElapsedTime] = useState(0);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Fetch kviza i pitanja
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      const quizData = await getQuizById(Number(id));
      setQuiz(quizData);
      setTimeLeft(quizData.timeLimit * 60); // sekunde

      const questionData = await getQuestionsByQuizId(Number(id));
      setQuestions(questionData);
    };
    fetchData();
  }, [id]);

  // Timer
  useEffect(() => {
    if (!quiz || questions.length === 0) return;

    if (timeLeft <= 0) {
      handleFinishQuiz();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz, questions, timeLeft]);

  const handleAnswer = (questionId: number, answer: any) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleFinishQuiz();
    }
  };

  const handleFinishQuiz = async () => {
    let score = 0;
    let maxPoints = 0; // ukupna suma težina

    questions.forEach((q) => {
      const userAnswer = answers[q.id];
      const questionWeight = q.weight || 1;
      maxPoints += questionWeight; // sabiramo maksimalne poene

      let questionScore = 0;

      if (q.questionType === "SingleChoice") {
        if (
          typeof userAnswer === "number" &&
          q.answerOptions?.some((opt) => opt.id === userAnswer && opt.isCorrect)
        ) {
          questionScore = questionWeight;
        }
      } else if (q.questionType === "MultipleChoice") {
        const correctIds =
          q.answerOptions?.filter((o) => o.isCorrect).map((o) => o.id) || [];
        if (Array.isArray(userAnswer)) {
          const allCorrectChosen = correctIds.every((id) =>
            userAnswer.includes(id)
          );
          const noExtraChosen = userAnswer.every((id) =>
            correctIds.includes(id)
          );

          if (allCorrectChosen && noExtraChosen) {
            questionScore = questionWeight;
          }
        }
      } else if (q.questionType === "TrueFalse") {
        if (
          (userAnswer === "true" &&
            q.answerOptions?.some((o) => o.text === "Tačno" && o.isCorrect)) ||
          (userAnswer === "false" &&
            q.answerOptions?.some((o) => o.text === "Netačno" && o.isCorrect))
        ) {
          questionScore = questionWeight;
        }
      } else if (q.questionType === "Text") {
        const correctAnswers =
          q.answerOptions
            ?.filter((o) => o.isCorrect)
            .map((o) => o.text.toLowerCase().trim()) || [];
        if (
          typeof userAnswer === "string" &&
          correctAnswers.includes(userAnswer.toLowerCase().trim())
        ) {
          questionScore = questionWeight;
        }
      }

      score += questionScore;
    });

    const percentage =
      maxPoints > 0 ? ((score / maxPoints) * 100).toFixed(0) : "0";

    if (!quiz) return;

    const dto: SaveResultDto = {
      quizId: quiz.id,
      userId: user.id,
      score,
      timeTaken: elapsedTime,
      userAnswers: Object.entries(answers).map(([questionId, selected]) => {
        const q = questions.find((x) => x.id === Number(questionId));

        let selectedAnswerText = "";

        if (q?.questionType === "SingleChoice") {
          const opt = q.answerOptions?.find((o) => o.id === selected);
          selectedAnswerText = opt?.text || "";
        } else if (q?.questionType === "MultipleChoice") {
          selectedAnswerText = (selected as number[])
            .map((id) => q.answerOptions?.find((o) => o.id === id)?.text || "")
            .join(", ");
        } else if (q?.questionType === "TrueFalse") {
          selectedAnswerText = selected === "true" ? "Tačno" : "Netačno";
        } else if (q?.questionType === "Text") {
          selectedAnswerText = selected.toString();
        }

        return {
          questionId: Number(questionId),
          selectedAnswer: selectedAnswerText,
        };
      }),
    };

    try {
      await saveResult(dto);
    } catch (err) {
      console.error(err);
      alert("Greška pri čuvanju rezultata");
    }

    alert(`Kviz završen! Poeni: ${score}, Procenat: ${percentage}%`);
    navigate(`/quiz-details/${quiz?.id}`);
  };

  if (!quiz || questions.length === 0) return <p>Učitavanje kviza...</p>;

  const currentQuestion = questions[currentIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="take-quiz">
      <h2>{quiz.title}</h2>
      <div className="timer">
        ⏱ {minutes.toString().padStart(2, "0")}:
        {seconds.toString().padStart(2, "0")}
      </div>

      <h3>
        Pitanje {currentIndex + 1} od {questions.length}
      </h3>
      <p>{currentQuestion.text}</p>

      {currentQuestion.questionType === "SingleChoice" &&
        currentQuestion.answerOptions?.map((opt) => (
          <label key={opt.id}>
            <input
              type="radio"
              name={`q_${currentQuestion.id}`}
              value={opt.id}
              checked={(answers[currentQuestion.id] as number) === opt.id}
              onChange={() => handleAnswer(currentQuestion.id, opt.id)}
            />
            {opt.text}
          </label>
        ))}

      {currentQuestion.questionType === "MultipleChoice" &&
        currentQuestion.answerOptions?.map((opt) => (
          <label key={opt.id}>
            <input
              type="checkbox"
              value={opt.id}
              checked={(answers[currentQuestion.id] as number[])?.includes(
                opt.id
              )}
              onChange={(e) => {
                const prev = (answers[currentQuestion.id] as number[]) || [];
                if (e.target.checked)
                  handleAnswer(currentQuestion.id, [...prev, opt.id]);
                else
                  handleAnswer(
                    currentQuestion.id,
                    prev.filter((x) => x !== opt.id)
                  );
              }}
            />
            {opt.text}
          </label>
        ))}

      {currentQuestion.questionType === "Text" && (
        <input
          type="text"
          value={(answers[currentQuestion.id] as string) || ""}
          onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
        />
      )}

      {currentQuestion.questionType === "TrueFalse" && (
        <>
          <label>
            <input
              type="radio"
              name={`q_${currentQuestion.id}`}
              value="true"
              checked={answers[currentQuestion.id] === "true"}
              onChange={() => handleAnswer(currentQuestion.id, "true")}
            />
            Tačno
          </label>
          <label>
            <input
              type="radio"
              name={`q_${currentQuestion.id}`}
              value="false"
              checked={answers[currentQuestion.id] === "false"}
              onChange={() => handleAnswer(currentQuestion.id, "false")}
            />
            Netačno
          </label>
        </>
      )}

      <button onClick={handleNext}>
        {currentIndex < questions.length - 1 ? "Sledeće" : "Završi kviz"}
      </button>
    </div>
  );
};

export default TakeQuiz;
