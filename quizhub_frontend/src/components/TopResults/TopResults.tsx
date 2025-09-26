import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import { getTopResults, TopResult } from "../service/ResultsService";
import { getAllQuizzes } from "../service/HomeService"; // koristimo servis za kvizove
import { useNavigate } from "react-router-dom";
import "./TopResults.css";

interface Quiz {
  id: number;
  title: string;
}

const TopResults: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [results, setResults] = useState<TopResult[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [quizFilter, setQuizFilter] = useState<number | undefined>(undefined);
  const [periodFilter, setPeriodFilter] = useState<
    "weekly" | "monthly" | undefined
  >(undefined);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    onLogout();
    navigate("/login", { replace: true });
  };

  const fetchResults = () => {
    getTopResults(quizFilter, periodFilter)
      .then(setResults)
      .catch(console.error);
  };

  useEffect(() => {
    fetchResults();
  }, [quizFilter, periodFilter]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await getAllQuizzes();
        setQuizzes(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuizzes();
  }, []);

  // filter da prikazemo samo najbolji rezultat po kvizu (bez obzira na korisnika)
  const bestResultPerQuiz = results.reduce((acc: TopResult[], curr) => {
    const existing = acc.find((r) => r.quizId === curr.quizId);

    if (!existing || curr.score > existing.score) {
      // uklanjamo stari i dodajemo bolji
      return [...acc.filter((r) => r.quizId !== curr.quizId), curr];
    }

    return acc;
  }, []);

  return (
    <div>
      <Header onLogout={handleLogout} />
      <div className="topresults-container">
        <h2>Top rezultati po kvizovima</h2>

        <div className="filters">
          <label>
            Filter po kvizu:
            <select
              value={quizFilter || ""}
              onChange={(e) =>
                setQuizFilter(Number(e.target.value) || undefined)
              }
            >
              <option value="">Svi kvizovi</option>
              {quizzes.map((quiz) => (
                <option key={quiz.id} value={quiz.id}>
                  {quiz.title}
                </option>
              ))}
            </select>
          </label>

          <label>
            Filter po periodu:
            <select onChange={(e) => setPeriodFilter(e.target.value as any)}>
              <option value="">Sve</option>
              <option value="weekly">Nedeljni</option>
              <option value="monthly">Mesečni</option>
            </select>
          </label>
        </div>

        <table className="topresults-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Kviz</th>
              <th>Korisnik</th>
              <th>Poeni</th>
              <th>Vreme (s)</th>
              <th>Datum</th>
            </tr>
          </thead>
          <tbody>
            {bestResultPerQuiz.map((r) => (
              <tr key={`${r.quizId}-${r.username}`}>
                <td>{r.position}</td>
                <td>{r.quizTitle}</td>
                <td>{r.username}</td>
                <td>{r.score}</td>
                <td>{r.timeTaken}</td>
                <td>{new Date(r.datePlayed).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopResults;
