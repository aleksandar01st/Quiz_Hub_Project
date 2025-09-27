import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getResultsByUser, QuizResult } from "../service/ResultsService";
import Header from "../Header/Header";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./MyResults.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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
      getResultsByUser(user.id)
        .then((res) => setResults(res))
        .catch((err) => console.error(err));
    }
  }, [user]);

  // Grupisanje rezultata po kvizu
  const groupedResults = results.reduce(
    (acc: Record<string, { score: number; date: Date }[]>, r) => {
      if (!acc[r.quizTitle]) acc[r.quizTitle] = [];
      acc[r.quizTitle].push({ score: r.score, date: new Date(r.datePlayed) });
      return acc;
    },
    {}
  );

  return (
    <div>
      <Header onLogout={handleLogout} />
      <div className="myresults-container">
        <h2>Moji rezultati</h2>
        {/* Tabela sa rezultatima */}
        <table className="myresults-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Kviz</th>
              <th>Poeni</th>
              {/* <th>Procenat</th> */}
              <th>Vreme (s)</th>
              <th>Datum</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, index) => {
              const percentage =
                r.totalPoints > 0
                  ? ((r.score / r.totalPoints) * 100).toFixed(0)
                  : "0";

              return (
                <tr
                  key={r.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/my-results/${r.id}`)}
                >
                  <td>{index + 1}</td>
                  <td>{r.quizTitle}</td>
                  <td>{r.score}</td>
                  {/* <td>{percentage}%</td> */}
                  <td>{r.timeTaken}</td>
                  <td>{new Date(r.datePlayed).toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Grafici po kvizovima */}
        <div className="charts-container">
          {Object.keys(groupedResults).length > 0 ? (
            Object.keys(groupedResults).map((quiz) => {
              let quizData = groupedResults[quiz];

              // Sortiranje po datumu rastuće
              quizData = quizData.sort(
                (a, b) => a.date.getTime() - b.date.getTime()
              );

              const data = {
                labels: quizData.map((r) => r.date.toLocaleString()),
                datasets: [
                  {
                    label: "Poeni",
                    data: quizData.map((r) => r.score),
                    fill: false,
                    borderColor: "rgb(75, 192, 192)",
                    backgroundColor: "rgb(75, 192, 192)",
                    tension: 0.2,
                  },
                ],
              };

              const options = {
                responsive: true,
                plugins: {
                  legend: { position: "top" as const },
                  title: { display: true, text: `Rezultati kviza: ${quiz}` },
                },
                scales: {
                  y: { beginAtZero: true, stepSize: 1 },
                },
              };

              return (
                <div key={quiz} className="quiz-chart">
                  <Line data={data} options={options} />
                </div>
              );
            })
          ) : (
            <p>Nema dovoljno podataka za grafikone.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyResults;
