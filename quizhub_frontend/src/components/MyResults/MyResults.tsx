import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "../Header/Header";
import { useNavigate } from "react-router-dom";
import "./MyResults.css";

interface QuizResult {
  id: number;
  score: number;
  timeTaken: number;
  datePlayed: string;
  username: string;
  quizTitle: string;
}

const MyResults: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [results, setResults] = useState<QuizResult[]>([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    onLogout(); // osvežava state u App.tsx
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    if (user && user.id) {
      axios
        .get(`https://localhost:7119/api/results/user/${user.id}`)
        .then((res) => setResults(res.data))
        .catch((err) => console.error(err));
    }
  }, [user]);

  return (
    <div>
      <Header onLogout={handleLogout} />
      <div className="myresults-container">
        <h2>Moji rezultati</h2>
        <table className="myresults-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Kviz</th>
              <th>Poeni</th>
              <th>Vreme (s)</th>
              <th>Datum</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, index) => (
              <tr
                key={r.id}
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/my-results/${r.id}`)}
              >
                <td>{index + 1}</td>
                <td>{r.quizTitle}</td>
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

export default MyResults;
