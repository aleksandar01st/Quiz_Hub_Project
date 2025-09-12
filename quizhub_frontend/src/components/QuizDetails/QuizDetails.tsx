import React, { useEffect, useState } from "react";
import "./QuizDetails.css";
import { useParams } from "react-router-dom";
// import { getQuizById, getQuizResults } from "./quizDetailsService";

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
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    if (id) {
      // setQuiz(getQuizById(parseInt(id)));
      // setResults(getQuizResults(parseInt(id)));
    }
  }, [id]);

  return (
    <div className="quiz-details">
      {quiz && (
        <>
          <h2>{quiz.title}</h2>
          <p>{quiz.description}</p>
          <p>
            <strong>Pitanja:</strong> {quiz.questionsCount}
          </p>
          <p>
            <strong>Težina:</strong> {quiz.difficulty}
          </p>
          <p>
            <strong>Vreme:</strong> {quiz.timeLimit} min
          </p>

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
