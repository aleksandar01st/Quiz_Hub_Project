import React, { useState } from "react";
import "../Login/Login.css";
import { createUser } from "../service/UserService";
import { CreateUserDto } from "../helper/user";

function Register() {
  const [form, setForm] = useState<CreateUserDto>({
    username: "",
    email: "",
    password: "",
    role: "User",
    profileImage: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ novo: error poruka sa backa
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({ ...form, profileImage: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null); // resetujemo error

    if (form.password !== confirmPassword) {
      setError("Lozinke se ne poklapaju!");
      return;
    }

    try {
      setLoading(true);
      await createUser(form);
      alert("Registracija uspešna! Možete se prijaviti.");
      window.location.href = "/login";
    } catch (err: any) {
      // ✅ backend šalje { message: "tekst greške" }
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Došlo je do greške pri registraciji.");
      }
    } finally {
      setLoading(false);
    }
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
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Unesite korisničko ime"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Unesite email"
              required
            />
          </div>

          <div className="form-group">
            <label>Lozinka</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
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

          <div className="form-group">
            <label>Profilna slika</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {form.profileImage && (
              <img
                src={form.profileImage}
                alt="Preview"
                style={{
                  marginTop: "10px",
                  maxWidth: "100px",
                  borderRadius: "50%",
                }}
              />
            )}
          </div>

          {/* ✅ Error message */}
          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Registracija..." : "Registracija"}
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
