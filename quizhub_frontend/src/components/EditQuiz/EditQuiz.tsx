import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { updateQuiz, getQuizById } from "../service/HomeService";
import Header from "../Header/Header";
import "./EditQuiz.css";

const EditQuiz: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "",
    timeLimit: 10,
  });

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        if (id) {
          const data = await getQuizById(Number(id));
          if (data) {
            setQuizData({
              title: data.title,
              description: data.description,
              category: data.category,
              difficulty: data.difficulty,
              timeLimit: data.timeLimit,
            });
          } else {
            alert("Kviz nije pronađen");
            navigate("/home");
          }
        }
      } catch (err: any) {
        console.error(err);
        alert("Greška pri učitavanju kviza");
      }
    };
    fetchQuiz();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setQuizData({
      ...quizData,
      [name]: name === "timeLimit" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id) {
        await updateQuiz(Number(id), quizData);
        alert("Kviz uspešno izmenjen!");
        navigate("/home");
      }
    } catch (err: any) {
      console.error(err);
      alert("Greška pri izmeni kviza");
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

      <div className="edit-quiz-container">
        <h2>Izmeni kviz</h2>
        <form className="edit-quiz-form" onSubmit={handleSubmit}>
          <label>
            Naslov:
            <input
              type="text"
              name="title"
              value={quizData.title}
              onChange={handleChange}
            />
          </label>

          <label>
            Opis:
            <textarea
              name="description"
              value={quizData.description}
              onChange={handleChange}
            />
          </label>

          <label>
            Kategorija:
            <input
              type="text"
              name="category"
              value={quizData.category}
              onChange={handleChange}
            />
          </label>

          <label>
            Težina:
            <select
              name="difficulty"
              value={quizData.difficulty}
              onChange={handleChange}
            >
              <option value="Lako">Lako</option>
              <option value="Srednje">Srednje</option>
              <option value="Teško">Teško</option>
            </select>
          </label>

          <label>
            Vreme (min):
            <input
              type="number"
              name="timeLimit"
              value={quizData.timeLimit}
              onChange={handleChange}
            />
          </label>

          <div className="form-buttons">
            <button
              type="button"
              className="back-btn"
              onClick={() => navigate("/home")}
            >
              Nazad
            </button>
            <button type="submit" className="submit-btn">
              Sačuvaj izmene
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditQuiz;
