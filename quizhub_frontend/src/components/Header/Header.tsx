import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const username = user.username || "Korisnik";
  const userImage = user.profileImage || "/image/default-avatar.png";

  const handleLogout = () => {
    localStorage.clear();
    onLogout(); // osvežava state u App.tsx
    navigate("/login", { replace: true });
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
