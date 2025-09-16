import React from "react";
import "./QuizCard.css";

interface QuizCardProps {
  id: number;
  title: string;
  description: string;
  questionsCount: number;
  difficulty: string;
  timeLimit: number;
  onClick: (id: number) => void;
  onDelete?: (id: number) => void;
}

const QuizCard: React.FC<QuizCardProps> = ({
  id,
  title,
  description,
  questionsCount,
  difficulty,
  timeLimit,
  onClick,
  onDelete,
}) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "Admin";

  return (
    <div className="quiz-card">
      <div onClick={() => onClick(id)} style={{ cursor: "pointer" }}>
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="quiz-info">
          <span>⏱ {questionsCount} pitanja</span>
          <span>📊 {difficulty}</span>
          <span>🕒 {timeLimit} min</span>
        </div>
      </div>

      {isAdmin && onDelete && (
        <button
          className="delete-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(id);
          }}
        >
          Obriši kviz
        </button>
      )}
    </div>
  );
};

export default QuizCard;
