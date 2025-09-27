import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import QuizDetails from "./components/QuizDetails/QuizDetails";
import CreateQuiz from "./components/CreateQuiz/CreateQuiz";
import EditQuiz from "./components/EditQuiz/EditQuiz";
import AddQuestion from "./components/AddQuestion/AddQuestion";
import TakeQuiz from "./components/TakeQuiz/TakeQuiz";
import Leaderboard from "./components/Leaderboard/Leaderboard";
import MyResults from "./components/MyResults/MyResults";
import QuizResultDetails from "./components/QuizResultDetails/QuizResultDetails";
import TopResults from "./components/TopResults/TopResults";
import EditQuestion from "./components/EditQuestion/EditQuestion";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

  // Funkcija za logout
  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false); // osvežava state → rerender i redirect
  };

  // Funkcija za login
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Home onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/home"
          element={
            isLoggedIn ? (
              <Home onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/login"
          element={
            !isLoggedIn ? (
              <Login onLogin={handleLogin} />
            ) : (
              <Navigate to="/home" />
            )
          }
        />
        <Route
          path="/register"
          element={!isLoggedIn ? <Register /> : <Navigate to="/home" />}
        />
        <Route
          path="/quiz/:id"
          element={
            isLoggedIn ? (
              <QuizDetails onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/create-quiz"
          element={
            isLoggedIn ? (
              <CreateQuiz onLogout={handleLogout} />
            ) : (
              <Navigate to="/home" />
            )
          }
        />
        <Route
          path="/edit-quiz/:id"
          element={
            isLoggedIn ? (
              <EditQuiz onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/add-question/:quizId"
          element={isLoggedIn ? <AddQuestion /> : <Navigate to="/login" />}
        />
        <Route
          path="/take-quiz/:id"
          element={isLoggedIn ? <TakeQuiz /> : <Navigate to="/login" />}
        />
        <Route
          path="/leaderboard"
          element={
            isLoggedIn ? (
              <Leaderboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/my-results"
          element={
            isLoggedIn ? (
              <MyResults onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/top-results"
          element={
            isLoggedIn ? (
              <TopResults onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/my-results/:resultId"
          element={
            isLoggedIn ? (
              <QuizResultDetails onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route
          path="/add-or-edit-question/:questionId"
          element={
            isLoggedIn ? (
              <EditQuestion onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
