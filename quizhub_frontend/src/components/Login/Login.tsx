import React, { useState } from "react";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Login attempt:", { username, password });
    // ovde ide poziv ka backendu preko authService
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">KvizHub</h2>
        <p className="login-subtitle">Prijavite se na svoj nalog</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Korisničko ime ili email</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Unesite korisničko ime ili email"
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

          <button type="submit" className="login-btn">
            Prijava
          </button>
        </form>

        <p className="register-link">
          Nemate nalog? <a href="/register">Registrujte se</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
