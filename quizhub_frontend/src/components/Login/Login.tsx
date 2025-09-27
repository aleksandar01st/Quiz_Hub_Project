import React, { useState } from "react";
import "./Login.css";
import { login } from "../service/AuthService";
import { LoginDto, AuthResponseDto } from "../helper/auth";
import { LoginProps } from "../helper/LoginProps";

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const dto: LoginDto = { usernameOrEmail, password };

    try {
      setLoading(true);
      const result: AuthResponseDto = await login(dto);

      // Čuvanje tokena i celog user objekta
      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      if (onLogin) onLogin();

      window.location.href = "/home";
    } catch (error) {
      console.error("Greška pri loginu:", error);
      alert("Pogrešni kredencijali ili server nedostupan.");
    } finally {
      setLoading(false);
    }
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
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
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

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Prijavljivanje..." : "Prijava"}
          </button>
        </form>

        <p className="register-link">
          Nemate nalog? <a href="/register">Registrujte se</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
