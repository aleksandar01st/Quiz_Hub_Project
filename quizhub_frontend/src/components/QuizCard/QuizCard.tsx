import React, { useState } from "react";
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
  onEdit?: (
    id: number,
    data: {
      title: string;
      description: string;
      difficulty: string;
      timeLimit: number;
    }
  ) => void;
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
  onEdit,
}) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "Admin";
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title,
    description,
    difficulty,
    timeLimit,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setEditData({
      ...editData,
      [name]: name === "timeLimit" ? Number(value) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onEdit) {
      onEdit(id, editData);
    }
    setIsEditing(false);
  };

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

      {isAdmin && (
        <div className="admin-actions">
          <button
            className="edit-btn"
            onClick={(e) => {
              e.stopPropagation();
              window.location.href = `/edit-quiz/${id}`;
            }}
          >
            Izmeni kviz
          </button>
          {onDelete && (
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
      )}
    </div>
  );
};

export default QuizCard;
