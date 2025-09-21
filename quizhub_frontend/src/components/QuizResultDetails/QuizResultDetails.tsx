import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../Header/Header";
import "./QuizResultDetails.css";

interface UserAnswer {
  questionText: string;
  selectedAnswer: string;
  correctAnswer: string;
}

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
      axios
        .get(`https://localhost:7119/api/results/answers/${resultId}`)
        .then((res) => setAnswers(res.data))
        .catch((err) => console.error(err));
    }
  }, [resultId]);

  return (
    <div>
      <Header onLogout={handleLogout} />
      <div className="quiz-details-container">
        <div className="quiz-details-header">
          <h2>Odgovori na kviz</h2>
          <button className="back-btn" onClick={handleBack}>
            Nazad
          </button>
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
            {answers.map((a, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{a.questionText}</td>
                <td>{a.selectedAnswer}</td>
                <td>{a.correctAnswer}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QuizResultDetails;
