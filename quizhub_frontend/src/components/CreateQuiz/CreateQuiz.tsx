import React, { useState } from "react";
import "./CreateQuiz.css";
import { useNavigate } from "react-router-dom";
import { createQuiz } from "../service/QuizService";
import { CreateQuizDto } from "../helper/CreateQuizDto";
import Header from "../Header/Header";

const CreateQuiz: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState<CreateQuizDto>({
    title: "",
    description: "",
    category: "",
    difficulty: "Lako",
    timeLimit: 10,
  });

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
      await createQuiz(quizData);
      alert("Kviz je uspešno kreiran!");
      navigate("/home");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Greška pri kreiranju kviza");
    }
  };

  const handleBack = () => {
    navigate("/home");
  };

  const handleLogout = () => {
    localStorage.clear();
    onLogout(); // osvežava state u App.tsx
    navigate("/login", { replace: true });
  };

  return (
    <div>
      <Header onLogout={handleLogout} />
      <div className="create-quiz-container">
        <div className="form-wrapper">
          <h2>Kreiraj novi kviz</h2>
          <form className="create-quiz-form" onSubmit={handleSubmit}>
            <label>
              Naslov:
              <input
                type="text"
                name="title"
                value={quizData.title}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Opis:
              <textarea
                name="description"
                value={quizData.description}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Kategorija:
              <input
                type="text"
                name="category"
                value={quizData.category}
                onChange={handleChange}
                placeholder="Unesi kategoriju"
                required
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
                min={1}
                required
              />
            </label>

            <div className="form-buttons">
              <button type="button" className="back-btn" onClick={handleBack}>
                Nazad
              </button>
              <button type="submit" className="submit-btn">
                Kreiraj kviz
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;
