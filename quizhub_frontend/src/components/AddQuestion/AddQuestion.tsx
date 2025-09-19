import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createQuestion } from "../service/QuizDetailsService";
import "./AddQuestion.css";

const AddQuestion: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [questionType, setQuestionType] = useState("SingleChoice"); // primer tipa
  const [loading, setLoading] = useState(false);
  const [answerOptions, setAnswerOptions] = useState<
    { text: string; isCorrect: boolean }[]
  >([]);
  const [trueFalseAnswer, setTrueFalseAnswer] = useState<boolean | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizId) return;

    if (!text.trim()) {
      alert("Tekst pitanja je obavezan.");
      return;
    }

    // pripremi payload
    const payload: any = {
      text,
      questionType,
      quizId: parseInt(quizId),
    };

    if (
      questionType === "Text" ||
      questionType === "SingleChoice" ||
      questionType === "MultipleChoice"
    ) {
      payload.answerOptions = answerOptions;
    } else if (questionType === "TrueFalse") {
      payload.answerOptions = [
        { text: trueFalseAnswer ? "Tačno" : "Netačno", isCorrect: true },
      ];
    }

    setLoading(true);
    try {
      await createQuestion(payload);
      alert("Pitanje je uspešno dodato.");
      navigate(`/quiz-details/${quizId}`);
    } catch (err) {
      console.error(err);
      alert("Greška pri dodavanju pitanja.");
    } finally {
      setLoading(false);
    }
  };

  const addAnswerOption = () => {
    setAnswerOptions([...answerOptions, { text: "", isCorrect: false }]);
  };

  const updateAnswerOption = (
    index: number,
    text: string,
    isCorrect: boolean
  ) => {
    const newOptions = [...answerOptions];
    newOptions[index] = { text, isCorrect };
    setAnswerOptions(newOptions);
  };

  const removeAnswerOption = (index: number) => {
    setAnswerOptions(answerOptions.filter((_, i) => i !== index));
  };

  return (
    <div className="question-form">
      <h2>Dodaj novo pitanje</h2>

      <form onSubmit={handleSubmit}>
        <label>Tekst pitanja:</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />

        <label>Tip pitanja:</label>
        <select
          value={questionType}
          onChange={(e) => {
            setQuestionType(e.target.value);
            setAnswerOptions([]);
            setTrueFalseAnswer(null);
          }}
        >
          <option value="SingleChoice">Single Choice</option>
          <option value="MultipleChoice">Multiple Choice</option>
          <option value="Text">Tekstualni odgovor</option>
          <option value="TrueFalse">Tačno/Netačno</option>
        </select>

        {questionType === "SingleChoice" ||
        questionType === "MultipleChoice" ? (
          <>
            <h3>Odgovori</h3>
            {answerOptions.map((option, index) => (
              <div key={index} className="answer-option">
                <input
                  type="text"
                  placeholder={`Odgovor ${index + 1}`}
                  value={option.text}
                  onChange={(e) =>
                    updateAnswerOption(index, e.target.value, option.isCorrect)
                  }
                  required
                />
                <label>
                  Tačan
                  <input
                    type={
                      questionType === "SingleChoice" ? "radio" : "checkbox"
                    }
                    name="correctAnswer"
                    checked={option.isCorrect}
                    onChange={(e) =>
                      updateAnswerOption(index, option.text, e.target.checked)
                    }
                  />
                </label>
                <button type="button" onClick={() => removeAnswerOption(index)}>
                  Obriši
                </button>
              </div>
            ))}
            <button type="button" onClick={addAnswerOption}>
              Dodaj odgovor
            </button>
          </>
        ) : questionType === "Text" ? (
          <>
            <label>Tačan odgovor:</label>
            <input
              type="text"
              value={answerOptions[0]?.text || ""}
              onChange={(e) =>
                setAnswerOptions([{ text: e.target.value, isCorrect: true }])
              }
              required
            />
          </>
        ) : questionType === "TrueFalse" ? (
          <>
            <h3>Odgovor:</h3>
            <label>
              <input
                type="radio"
                name="trueFalse"
                checked={trueFalseAnswer === true}
                onChange={() => setTrueFalseAnswer(true)}
              />
              Tačno
            </label>
            <label>
              <input
                type="radio"
                name="trueFalse"
                checked={trueFalseAnswer === false}
                onChange={() => setTrueFalseAnswer(false)}
              />
              Netačno
            </label>
          </>
        ) : null}

        <button type="submit" disabled={loading}>
          {loading ? "Dodavanje..." : "Dodaj pitanje"}
        </button>
        <button type="button" onClick={() => navigate(-1)}>
          Otkaži
        </button>
      </form>
    </div>
  );
};

export default AddQuestion;
