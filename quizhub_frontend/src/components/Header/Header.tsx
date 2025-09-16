import React from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    onLogout(); // osvežava state u App.tsx
    navigate("/login", { replace: true });
  };

  return (
    <header className="header">
      <div className="header-left">
        <img src="/image/QuizHub_logo.png" className="logo-img" />
        <span className="logo-text">KvizHub</span>
      </div>
      <div className="header-right">
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
