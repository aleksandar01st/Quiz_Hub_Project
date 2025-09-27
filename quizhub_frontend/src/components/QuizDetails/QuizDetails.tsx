import React, { useEffect, useState } from "react";
import Header from "../Header/Header";
import "./QuizDetails.css";
import { useParams, useNavigate } from "react-router-dom";
import {
  getQuizById,
  getQuestionsByQuizId,
  deleteQuestion,
} from "../service/QuizDetailsService";
import { getResultsByQuiz } from "../service/ResultService";
import { Quiz, Result, Question } from "../helper/Qiuz";

const QuizDetails: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "Admin";

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!id) return; // proverava da li postoji id

      try {
        const data = await getQuizById(parseInt(id));
        setQuiz(data);

        const questionData = await getQuestionsByQuizId(parseInt(id));
        setQuestions(questionData);

        const resultsData = await getResultsByQuiz(parseInt(id));
        // mapiraj vreme u "mm:ss" format ako želiš
        const formattedResults = resultsData.map((r) => ({
          username: r.username,
          score: r.score,
          time: new Date(r.timeTaken * 1000).toISOString().substr(14, 5), // mm:ss
        }));
        setResults(formattedResults);
      } catch (err) {
        console.error(err);
        alert("Greška pri učitavanju kviza");
      }
    };

    fetchQuiz();
  }, [id]);

  const handleDeleteQuestion = async (questionId: number) => {
    if (!window.confirm("Da li ste sigurni da želite da obrišete ovo pitanje?"))
      return;

    try {
      await deleteQuestion(questionId); // poziv servisa
      setQuestions(questions.filter((q) => q.id !== questionId));
      alert("Pitanje je obrisano.");
    } catch (err) {
      console.error(err);
      alert("Greška prilikom brisanja pitanja.");
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    onLogout(); // osvežava state u App.tsx
    navigate("/login", { replace: true });
  };

  return (
    <div>
      <Header onLogout={handleLogout} />
      <div className="quiz-details">
        <button className="back-btn" onClick={() => navigate(`/`)}>
          ← Nazad
        </button>
        {quiz && (
          <>
            <div className="quiz-info-card">
              <h2>{quiz.title}</h2>
              <p>{quiz.description}</p>
              <div className="quiz-meta">
                <span>📋 {questions.length} pitanja</span>
                <span>📊 Težina: {quiz.difficulty}</span>
                <span>⏱ {quiz.timeLimit} min</span>
                <span>
                  💪 Ukupna težina:{" "}
                  {questions.reduce((sum, q) => sum + (q.weight || 1), 0)}
                  bodova
                </span>
              </div>

              <h3>Pitanja u kvizu</h3>
              {isAdmin ? (
                questions.length === 0 ? (
                  <p>Ovaj kviz trenutno nema pitanja.</p>
                ) : (
                  <ul className="questions-list">
                    {questions.map((q, index) => (
                      <li
                        key={q.id}
                        className="question-item clickable" // dodaj CSS klasu da vizuelno izgleda klikabilno
                        onClick={() =>
                          navigate(`/add-or-edit-question/${q.id}`)
                        } // ide na stranicu za edit
                      >
                        <div className="question-text">
                          <strong>{index + 1}.</strong> {q.text}{" "}
                          <em>
                            ({q.questionType}, težina: {q.weight})
                          </em>
                        </div>
                      </li>
                    ))}
                  </ul>
                )
              ) : (
                <p>
                  Samo administratori mogu da vide pitanja ovog kviza. Zapocni
                  kviz da vidis pitanja :)
                </p>
              )}

              {isAdmin && (
                <button
                  className="add-btn"
                  onClick={() => navigate(`/add-question/${quiz?.id}`)}
                >
                  Dodaj novo pitanje
                </button>
              )}
            </div>

            <h3>Rezultati igrača</h3>
            <table className="results-table">
              <thead>
                <tr>
                  <th>Korisnik</th>
                  <th>Poeni</th>
                  <th>Procenat</th>
                  <th>Vreme</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r, index) => {
                  // maksimalni broj poena sabiranjem težina pitanja
                  const maxPoints = questions.reduce(
                    (sum, q) => sum + (q.weight || 1),
                    0
                  );
                  const percentage =
                    maxPoints > 0
                      ? ((r.score / maxPoints) * 100).toFixed(0)
                      : "0";

                  return (
                    <tr key={index}>
                      <td>{r.username}</td>
                      <td>{r.score}</td>
                      <td>{percentage}%</td> {/* prikaz postotka */}
                      <td>{r.time}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {!isAdmin && (
              <button
                className="start-btn"
                onClick={() => navigate(`/take-quiz/${quiz.id}`)}
              >
                Započni kviz
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default QuizDetails;
