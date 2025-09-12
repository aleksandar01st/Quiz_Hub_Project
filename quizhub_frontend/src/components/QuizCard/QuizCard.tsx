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
}

const QuizCard: React.FC<QuizCardProps> = ({
  id,
  title,
  description,
  questionsCount,
  difficulty,
  timeLimit,
  onClick,
}) => {
  return (
    <div className="quiz-card" onClick={() => onClick(id)}>
      <h3>{title}</h3>
      <p>{description}</p>
      <div className="quiz-info">
        <span>⏱ {questionsCount} pitanja</span>
        <span>📊 {difficulty}</span>
        <span>🕒 {timeLimit} min</span>
      </div>
    </div>
  );
};

export default QuizCard;
