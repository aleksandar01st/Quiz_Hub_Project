import React from "react";
import "./Header.css";

interface HeaderProps {
  onLogout?: () => void; // callback za logout
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  return (
    <header className="header">
      <div className="header-left">
        <img src="/image/QuizHub_logo.png" className="logo-img" />
        <span className="logo-text">KvizHub</span>
      </div>
      <div className="header-right">
        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
