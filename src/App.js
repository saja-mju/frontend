// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeWithDailyQuiz from "./pages/HomeWithDailyQuiz";
import LearnPage from "./pages/LearnPage";
import WordCardPage from "./pages/WordCardPage";
import QuizPage from "./pages/QuizPage";
import WrongNotePage from "./pages/WrongNotePage";
import SynonymQuizPage from "./pages/SynonymQuizPage";
import HanjaComboPage from "./pages/HanjaComboPage";
import DailyQuizModal from "./components/DailyQuizModal";
import CalendarModal from "./components/CalendarModal";
import RankingPage from "./pages/RankingPage";



import { useState } from "react";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [nickname, setNickname] = useState("");
  const [progress, setProgress] = useState(80);
  const [accuracy, setAccuracy] = useState(30);

  const [wrongAnswersMap, setWrongAnswersMap] = useState({});

  return (
    <Router>
      <Routes>
        <Route
          path="/learn"
          element={
            <LearnPage
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
            />
          }
        />
        <Route
          path="/cards"
          element={
            <WordCardPage
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
            />
          }
        />
        <Route
          path="/quiz"
          element={
            <QuizPage
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              nickname={nickname}
              wrongAnswersMap={wrongAnswersMap}
              setWrongAnswersMap={setWrongAnswersMap}
            />
          }
        />
        <Route
          path="/wrong"
          element={
            <WrongNotePage
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              nickname={nickname}
              wrongAnswersMap={wrongAnswersMap}
            />
          }
        />
        <Route
          path="/quiz/synonym"
          element={
            <SynonymQuizPage
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
            />
          }
        />
        <Route
          path="/quiz/combo"
          element={
            <HanjaComboPage
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
            />
          }
        />
        <Route
          path="/"
          element={
            <HomeWithDailyQuiz
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
          path="/ranking"
          element={
            <RankingPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
