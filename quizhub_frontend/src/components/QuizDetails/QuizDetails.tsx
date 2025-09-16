import React, { useEffect, useState } from "react";
import "./QuizDetails.css";
import { useParams, useNavigate } from "react-router-dom";
import { getQuizById } from "../service/QuizDetailsService";

interface Quiz {
  id: number;
  title: string;
  description: string;
  questionsCount: number;
  difficulty: string;
  timeLimit: number;
  category: string;
}

interface Result {
  username: string;
  score: number;
  time: string;
}

const QuizDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!id) return; // proverava da li postoji id

      try {
        const data = await getQuizById(parseInt(id));
        setQuiz(data);

        // Ako želiš rezultate igrača, ovde možeš pozvati fetch za rezultate
        // const resultsData = await getQuizResults(parseInt(id));
        // setResults(resultsData);
      } catch (err) {
        console.error(err);
        alert("Greška pri učitavanju kviza");
      }
    };

    fetchQuiz();
  }, [id]);

  return (
    <div className="quiz-details">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Nazad
      </button>
      {quiz && (
        <>
          <div className="quiz-info-card">
            <h2>{quiz.title}</h2>
            <p>{quiz.description}</p>
            <div className="quiz-meta">
              <span>📋 {quiz.questionsCount} pitanja</span>
              <span>📊 Težina: {quiz.difficulty}</span>
              <span>⏱ {quiz.timeLimit} min</span>
            </div>
          </div>

          <h3>Rezultati igrača</h3>
          <table className="results-table">
            <thead>
              <tr>
                <th>Korisnik</th>
                <th>Poeni</th>
                <th>Vreme</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, index) => (
                <tr key={index}>
                  <td>{r.username}</td>
                  <td>{r.score}</td>
                  <td>{r.time}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button className="start-btn">Započni kviz</button>
        </>
      )}
    </div>
  );
};

export default QuizDetails;
