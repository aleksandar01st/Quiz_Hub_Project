// src/components/Register/Register.tsx
import React, { useState } from "react";
import "../Login/Login.css"; // koristimo isti CSS kao za login

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Lozinke se ne poklapaju!");
      return;
    }
    console.log("Register attempt:", { username, email, password });
    // ovde ide poziv ka backendu preko authService
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">KvizHub</h2>
        <p className="login-subtitle">Kreirajte novi nalog</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Korisničko ime</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Unesite korisničko ime"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Unesite email"
              required
            />
          </div>

          <div className="form-group">
            <label>Lozinka</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Unesite lozinku"
              required
            />
          </div>

          <div className="form-group">
            <label>Potvrda lozinke</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ponovite lozinku"
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Registracija
          </button>
        </form>

        <p className="register-link">
          Već imate nalog? <a href="/login">Prijavite se</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
