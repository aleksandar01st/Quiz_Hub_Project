import React, { useState, useEffect } from "react";
import "./Home.css";
import { Quiz } from "../helper/Qiuz";
import Header from "../Header/Header";
import QuizCard from "../QuizCard/QuizCard";
import { useNavigate } from "react-router-dom";
import {
  getAllQuizzes,
  deleteQuiz,
  getCategories,
  updateQuiz,
} from "../service/HomeService";

const Home: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Sve");
  const [difficulty, setDifficulty] = useState("Sve");
  const [categories, setCategories] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const data = await getAllQuizzes();
        setQuizzes(data);

        const cats = await getCategories();
        setCategories(cats);
      } catch (err) {
        console.error(err);
        alert("Greška pri učitavanju kvizova");
      }
    };
    fetchQuizzes();
  }, []);

  const handleQuizClick = (id: number) => {
    navigate(`/quiz/${id}`);
  };

  const handleDeleteQuiz = async (id: number) => {
    if (!window.confirm("Da li ste sigurni da želite da obrišete kviz?"))
      return;

    try {
      await deleteQuiz(id);
      // osveži listu kvizova
      setQuizzes(quizzes.filter((q) => q.id !== id));
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Greška pri brisanju kviza");
    }
  };

  const handleEditQuiz = async (
    id: number,
    updatedData: {
      title: string;
      description: string;
      difficulty: string;
      timeLimit: number;
    }
  ) => {
    try {
      const updatedQuiz = await updateQuiz(id, updatedData);

      // Osveži listu kvizova lokalno
      setQuizzes((prev) =>
        prev.map((q) => (q.id === id ? { ...q, ...updatedQuiz } : q))
      );

      alert("Kviz uspešno izmenjen!");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Greška pri izmeni kviza");
    }
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
            <option value="Sve">Sve kategorije</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="Sve">Sve težine</option>
            <option value="Lako">Lako</option>
            <option value="Srednje">Srednje</option>
            <option value="Teško">Teško</option>
          </select>
        </div>

        <h2 className="home-title">Dostupni kvizovi</h2>

        {/* Lista kvizova */}
        <div className="home-container">
          {/* <h2 className="home-title">Dostupni kvizovi</h2> */}
          <div className="quiz-list">
            {filteredQuizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                id={quiz.id}
                title={quiz.title}
                description={quiz.description}
                questionsCount={quiz.questionsCount}
                difficulty={quiz.difficulty}
                timeLimit={quiz.timeLimit}
                onClick={handleQuizClick}
                onDelete={handleDeleteQuiz}
                onEdit={handleEditQuiz}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
