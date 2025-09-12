// src/App.tsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";

const App: React.FC = () => {
  // primer provere da li je korisnik ulogovan (može se kasnije zameniti sa realnom logikom)
  const isLoggedIn = false;

  return (
    <Router>
      <Routes>
        {/* Početna ruta */}
        {/* <Route
          path="/"
          element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
        /> */}
        <Route path="/" element={<Home />} />

        {/* Login ruta */}
        <Route path="/login" element={<Login />} />

        {/* Register ruta */}
        <Route path="/register" element={<Register />} />

        {/* Home ruta */}
        <Route
          path="/home"
          element={isLoggedIn ? <Home /> : <Navigate to="/login" />}
        />

        {/* fallback ruta */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
