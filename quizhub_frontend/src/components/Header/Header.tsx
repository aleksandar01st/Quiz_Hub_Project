import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HeaderProps } from "../helper/HeaderProps";
import "./Header.css";

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const username = user.username || "Korisnik";
  const userImage = user.profileImage || "/image/default-avatar.png";
  const role = user.role || "User";

  const handleLogout = () => {
    localStorage.clear();
    onLogout(); // osvežava state u App.tsx
    navigate("/login", { replace: true });
  };

  const handleCreateQuiz = () => {
    navigate("/create-quiz"); // ili odgovarajuća ruta za kreiranje kviza
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <div className="header-left">
        <img src="/image/QuizHub_logo.png" className="logo-img" />
        <span className="logo-text">KvizHub</span>
      </div>
      <div className="header-right" ref={menuRef}>
        <button className="create-quiz-btn" onClick={() => navigate("/")}>
          Home
        </button>
        {role === "Admin" && (
          <button className="create-quiz-btn" onClick={handleCreateQuiz}>
            Kreiraj kviz
          </button>
        )}
        {role === "User" && (
          <button
            className="create-quiz-btn"
            onClick={() => navigate("/my-results")}
          >
            Moji Rezultati
          </button>
        )}
        <button
          className="create-quiz-btn"
          onClick={() => navigate("/leaderboard")}
        >
          Rang Lista
        </button>

        <button
          className="create-quiz-btn"
          onClick={() => navigate("/top-results")}
        >
          Top Rezultati
        </button>

        <div className="user-info" onClick={() => setMenuOpen((prev) => !prev)}>
          <img
            src={userImage || "/image/default-avatar.png"}
            alt="Korisnik"
            className="user-avatar"
          />
          <span className="username">{username}</span>
        </div>

        {menuOpen && (
          <div className="dropdown-menu">
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
