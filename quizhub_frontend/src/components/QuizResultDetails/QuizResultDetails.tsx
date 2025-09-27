import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserAnswersByResult, UserAnswer } from "../service/ResultsService";
import Header from "../Header/Header";
import "./QuizResultDetails.css";

const QuizResultDetails: React.FC<{ onLogout: () => void }> = ({
  onLogout,
}) => {
  const { resultId } = useParams<{ resultId: string }>();
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    onLogout();
    navigate("/login", { replace: true });
  };

  const handleBack = () => {
    navigate("/my-results"); // vraća na listu rezultata
  };

  useEffect(() => {
    if (resultId) {
      getUserAnswersByResult(Number(resultId))
        .then((res) => setAnswers(res))
        .catch((err) => console.error(err));
    }
  }, [resultId]);

  return (
    <div>
      <Header onLogout={handleLogout} />
      <div className="quiz-details-container">
        <div className="quiz-details-header">
          <button className="back-btn" onClick={handleBack}>
            Nazad
          </button>
          <h2>Odgovori na kviz</h2>
        </div>

        <table className="quiz-details-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Pitanje</th>
              <th>Tvoj odgovor</th>
              <th>Tačan odgovor</th>
            </tr>
          </thead>
          <tbody>
            {answers.map((a, index) => {
              let isCorrect = false;

              // Ako korisnikov odgovor sadrži više vrednosti (MultipleChoice)
              if (a.selectedAnswer.includes(",")) {
                const userSet = new Set(
                  a.selectedAnswer.split(",").map((x) => x.trim().toLowerCase())
                );
                const correctSet = new Set(
                  a.correctAnswer.split(",").map((x) => x.trim().toLowerCase())
                );

                isCorrect =
                  userSet.size === correctSet.size &&
                  Array.from(userSet).every((val) => correctSet.has(val));
              } else {
                // SingleChoice, TrueFalse, Text
                isCorrect =
                  a.selectedAnswer.trim().toLowerCase() ===
                  a.correctAnswer.trim().toLowerCase();
              }

              return (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{a.questionText}</td>
                  <td
                    style={{
                      color: isCorrect ? "green" : "red",
                      fontWeight: isCorrect ? "bold" : "normal",
                    }}
                  >
                    {a.selectedAnswer}
                  </td>
                  <td>{a.correctAnswer}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuizResultDetails;
