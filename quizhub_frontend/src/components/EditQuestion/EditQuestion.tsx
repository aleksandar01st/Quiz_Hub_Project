import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import { useNavigate, useParams } from "react-router-dom";
import { updateQuestion, deleteQuestion } from "../service/QuizDetailsService";
import { getQuestionById } from "../service/QuestionService";
import "../AddQuestion/AddQuestion.css";

const EditQuestion: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const { questionId } = useParams<{ questionId: string }>();
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [weight, setWeight] = useState(1);
  const [questionType, setQuestionType] = useState("SingleChoice");
  const [answerOptions, setAnswerOptions] = useState<
    { text: string; isCorrect: boolean }[]
  >([]);
  const [trueFalseAnswer, setTrueFalseAnswer] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    onLogout(); // osvežava state u App.tsx
    navigate("/login", { replace: true });
  };

  // Učitaj pitanje na mount
  useEffect(() => {
    if (!questionId) return;

    const fetchQuestion = async () => {
      try {
        setLoading(true);
        const q = await getQuestionById(parseInt(questionId));

        setText(q.text);
        setWeight(q.weight || 1);
        setQuestionType(q.questionType);

        if (q.questionType === "TrueFalse") {
          setTrueFalseAnswer(q.answerOptions?.[0]?.text === "Tačno");
          setAnswerOptions([]);
        } else {
          setAnswerOptions(
            q.answerOptions?.map(
              (a: { id: number; text: string; isCorrect: boolean }) => ({
                text: a.text,
                isCorrect: a.isCorrect,
              })
            ) || []
          );

          setTrueFalseAnswer(null);
        }
      } catch (err) {
        console.error(err);
        alert("Greška pri učitavanju pitanja.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestion();
  }, [questionId]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionId) return;

    const payload: any = { text, weight, questionType };

    if (
      questionType === "SingleChoice" ||
      questionType === "MultipleChoice" ||
      questionType === "Text"
    ) {
      payload.answerOptions = answerOptions;
    } else if (questionType === "TrueFalse") {
      payload.answerOptions = [
        { text: trueFalseAnswer ? "Tačno" : "Netačno", isCorrect: true },
      ];
    }

    setLoading(true);
    try {
      await updateQuestion(parseInt(questionId), payload);
      alert("Pitanje je ažurirano.");
      navigate(-1); // vrati na prethodnu stranicu
    } catch (err) {
      console.error(err);
      alert("Greška pri ažuriranju pitanja.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!questionId) return;
    if (!window.confirm("Da li ste sigurni da želite da obrišete ovo pitanje?"))
      return;

    try {
      await deleteQuestion(parseInt(questionId));
      alert("Pitanje je obrisano.");
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert("Greška pri brisanju pitanja.");
    }
  };

  const addAnswerOption = () =>
    setAnswerOptions([...answerOptions, { text: "", isCorrect: false }]);

  const updateAnswerOption = (
    index: number,
    text: string,
    isCorrect: boolean
  ) => {
    const newOptions = [...answerOptions];

    if (questionType === "SingleChoice" && isCorrect) {
      // Ako je SingleChoice, samo jedan odgovor može biti tačan
      newOptions.forEach((opt, i) => {
        opt.isCorrect = i === index;
      });
    } else {
      // Za MultipleChoice ili ako isCorrect=false kod SingleChoice
      newOptions[index] = { text, isCorrect };
    }

    setAnswerOptions(newOptions);
  };

  const removeAnswerOption = (index: number) =>
    setAnswerOptions(answerOptions.filter((_, i) => i !== index));

  return (
    <div>
      <Header onLogout={handleLogout} />

      <div className="question-form">
        <h2>Izmeni pitanje</h2>

        <form onSubmit={handleUpdate}>
          <label>Tekst pitanja:</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />

          <label>Težina pitanja:</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(parseInt(e.target.value))}
            min={1}
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

          {(questionType === "SingleChoice" ||
            questionType === "MultipleChoice") && (
            <>
              <h3>Odgovori</h3>
              {answerOptions.map((option, index) => (
                <div key={index} className="answer-option">
                  <input
                    type="text"
                    placeholder={`Odgovor ${index + 1}`}
                    value={option.text}
                    onChange={(e) =>
                      updateAnswerOption(
                        index,
                        e.target.value,
                        option.isCorrect
                      )
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
                  <button
                    type="button"
                    onClick={() => removeAnswerOption(index)}
                  >
                    Obriši
                  </button>
                </div>
              ))}
              <button type="button" onClick={addAnswerOption}>
                Dodaj odgovor
              </button>
            </>
          )}

          {questionType === "Text" && (
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
          )}

          {questionType === "TrueFalse" && (
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
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Čuvanje..." : "Sačuvaj izmene"}
          </button>
          <button type="button" onClick={() => navigate(-1)}>
            Otkaži
          </button>
          <button
            type="button"
            onClick={handleDelete}
            style={{ backgroundColor: "#e74c3c", color: "white" }}
          >
            Obriši pitanje
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditQuestion;
