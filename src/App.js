// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LearnPage from "./pages/LearnPage";
import { useState } from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [nickname, setNickname] = useState("");
  const [progress, setProgress] = useState(80);
  const [accuracy, setAccuracy] = useState(30);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              showLoginModal={showLoginModal}
              setShowLoginModal={setShowLoginModal}
              nickname={nickname}
              setNickname={setNickname}
              progress={progress}
              setProgress={setProgress}
              accuracy={accuracy}
              setAccuracy={setAccuracy}
            />
          }
        />
        <Route
          path="/learn"
          element={
            <LearnPage
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
