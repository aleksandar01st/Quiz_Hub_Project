import React, { useState, useEffect } from "react";
import "./Home.css";
import { Quiz } from "../helper/Qiuz";
import Header from "../Header/Header";
import QuizCard from "../QuizCard/QuizCard";
import { useNavigate } from "react-router-dom";
// import { getAllQuizzes } from "./homeService";

const Home: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Sve");
  const [difficulty, setDifficulty] = useState("Sve");
  const navigate = useNavigate();

  useEffect(() => {
    //  setQuizzes(getAllQuizzes());
  }, []);

  const handleQuizClick = (id: number) => {
    navigate(`/quiz/${id}`);
  };

  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch = quiz.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory = category === "Sve" || quiz.category === category;
    const matchesDifficulty =
      difficulty === "Sve" || quiz.difficulty === difficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <>
      <Header onLogout={onLogout} />
      <div className="home-container">
        {/* Filter bar */}
        <div className="filter-bar">
          <input
            type="text"
            placeholder="Pretraži..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Sve">Programiranje</option>
            <option value="Istorija">Istorija</option>
            <option value="Geografija">Geografija</option>
          </select>

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="Sve">Težina</option>
            <option value="Lako">Lako</option>
            <option value="Srednje">Srednje</option>
            <option value="Teško">Teško</option>
          </select>

          <button className="filter-btn">Filtriraj</button>
        </div>

        <h2 className="home-title">Dostupni kvizovi</h2>

        {/* Lista kvizova */}
        <div className="home-container">
          {/* <h2 className="home-title">Dostupni kvizovi</h2> */}
          <div className="quiz-list">
            {quizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                id={quiz.id}
                title={quiz.title}
                description={quiz.description}
                questionsCount={quiz.questionsCount}
                difficulty={quiz.difficulty}
                timeLimit={quiz.timeLimit}
                onClick={handleQuizClick}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
