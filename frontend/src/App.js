// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import HomeWithDailyQuiz from "./pages/HomeWithDailyQuiz";
import LearnPage from "./pages/LearnPage";
import WordCardPage from "./pages/WordCardPage";
import QuizPage from "./pages/QuizPage";
import WrongNotePage from "./pages/WrongNotePage";
import SynonymQuizPage from "./pages/SynonymQuizPage";
import HanjaComboPage from "./pages/HanjaComboPage";
import RankingPage from "./pages/RankingPage";
import DailyQuizModal from "./components/DailyQuizModal";
import CalendarModal from "./components/CalendarModal";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [nickname, setNickname] = useState("");
  const [progress, setProgress] = useState(80);
  const [accuracy, setAccuracy] = useState(30);
  const [showDailyResultModal, setShowDailyResultModal] = useState(false);
  const [quizHistory, setQuizHistory] = useState({});
  const [wrongAnswersMap, setWrongAnswersMap] = useState({});

  return (
    <Router>
      {/* 모달은 라우팅 외부에 위치 */}
      {showDailyResultModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <DailyQuizModal quizHistory={quizHistory} />
            <CalendarModal quizHistory={quizHistory} />
            <button
              onClick={() => setShowDailyResultModal(false)}
              className="mt-4 w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              닫기
            </button>
          </div>
        </div>
      )}

      <Routes>
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
              showDailyResultModal={showDailyResultModal}
              setShowDailyResultModal={setShowDailyResultModal}
              quizHistory={quizHistory}
              setQuizHistory={setQuizHistory}
            />
          }
        />
        <Route
          path="/learn"
          element={<LearnPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
        />
        <Route
          path="/cards"
          element={<WordCardPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
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
          element={<SynonymQuizPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} nickname={nickname}
            wrongAnswersMap={wrongAnswersMap}
            setWrongAnswersMap={setWrongAnswersMap} />}
        />
        <Route
          path="/quiz/combo"
          element={<HanjaComboPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} nickname={nickname}
      wrongAnswersMap={wrongAnswersMap}
      setWrongAnswersMap={setWrongAnswersMap}/>}
        />
        <Route
          path="/ranking"
          element={<RankingPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
