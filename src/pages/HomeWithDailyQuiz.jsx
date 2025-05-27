import { useEffect, useState } from "react";
import DailyQuizModal from "../components/DailyQuizModal";
import CalendarModal from "../components/CalendarModal";
import HomePage from "./HomePage";

const HomeWithDailyQuiz = ({
  isLoggedIn,
  setIsLoggedIn,
  showLoginModal,
  setShowLoginModal,
  nickname,
  setNickname,
  progress,
  setProgress,
  accuracy,
  setAccuracy,
}) => {
  const [showDailyQuiz, setShowDailyQuiz] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [quizHistory, setQuizHistory] = useState({});

  useEffect(() => {
    if (isLoggedIn) {
      const today = new Date().toISOString().split("T")[0];
      if (!quizHistory[today]) {
        setShowDailyQuiz(true);
      }
    }
  }, [isLoggedIn]);

  const handleSubmitQuiz = (isCorrect) => {
    const today = new Date().toISOString().split("T")[0];
    setQuizHistory((prev) => ({ ...prev, [today]: isCorrect ? "correct" : "wrong" }));
    setShowDailyQuiz(false);
    setShowCalendar(true);
  };

  return (
    <>
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

      {showDailyQuiz && <DailyQuizModal onSubmit={handleSubmitQuiz} />}

      {showCalendar && (
        <CalendarModal
          quizHistory={quizHistory}
          onClose={() => setShowCalendar(false)}
        />
      )}
    </>
  );
};

export default HomeWithDailyQuiz;
