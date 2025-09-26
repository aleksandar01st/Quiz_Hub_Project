import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import {
  getLeaderboard,
  LeaderboardEntry,
} from "../service/LeaderboardService";
import "./Leaderboard.css";

const Leaderboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    onLogout(); // osvežava state u App.tsx
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    getLeaderboard()
      .then((data) => setEntries(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <Header onLogout={handleLogout} />
      <div className="leaderboard-container">
        <h2>Globalna Rang Lista</h2>
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Korisnik</th>
              <th>Ukupno poena</th>
              <th>Odigrani kvizovi</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={entry.userId}>
                <td>{index + 1}</td>
                <td>{entry.username}</td>
                <td>{entry.totalScore}</td>
                <td>{entry.quizzesTaken}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
