// src/pages/HomeWithDailyQuiz.jsx
import { useEffect, useState } from "react";
import DailyQuizModal from "../components/DailyQuizModal";
import DailyResultModal from "../components/DailyResultModal";
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
  const [todayQuiz, setTodayQuiz] = useState(null);      // { id, word, meaning, from: "new"/"existing" }
  const [showDailyQuiz, setShowDailyQuiz] = useState(false);
  const [showDailyResult, setShowDailyResult] = useState(false);

  // 1) 컴포넌트가 마운트되거나 로그인 상태가 바뀔 때, 오늘의 문제 조회
  useEffect(() => {
    if (!isLoggedIn || !nickname) return;

    const fetchToday = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/results/daily/${nickname}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!res.ok) throw new Error("오늘의 문제 조회 실패");
        const data = await res.json();
        // data = { from: "new"/"existing", idiom: { id, word, meaning } }
        if (data.from === "new") {
          setTodayQuiz({
            id: data.idiom.id,
            word: data.idiom.word,
            meaning: data.idiom.meaning,
            from: "new",
          });
          setShowDailyQuiz(true);
        } else {
          // 이미 풀었다면, 결과 모달을 바로 띄워주자
          setTodayQuiz({
            id: data.idiom.id,
            word: data.idiom.word,
            meaning: data.idiom.meaning,
            from: "existing",
          });
          setShowDailyResult(true);
        }
      } catch (err) {
        console.error("getDailyIdiom error:", err);
      }
    };

    fetchToday();
  }, [isLoggedIn, nickname]);

  // 2) DailyQuizModal에서 제출한 후 호출되는 콜백
  const handleSubmitQuiz = async ({ idiomId, userAnswer }) => {
    // 2.1) 백엔드에 오늘 정답 제출
    try {
      const res = await fetch(
        `http://localhost:3000/results/daily/submit`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: nickname,
            idiomId,
            userAnswer,
          }),
        }
      );
      if (!res.ok) {
        console.error("daily submit failed:", res.status);
      }
    } catch (err) {
      console.error("submitDailyAnswer error:", err);
    }

    // 2.2) 화면용으로만 사용될 수 있는 임시 state 세팅
    // (실제 정답 여부는 DailyResultModal이 다시 서버로부터 fetch해서 보여줄 것)
    setShowDailyQuiz(false);
    setShowDailyResult(true);
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
        setShowDailyResultModal={setShowDailyResult}
      />

      {/* 오늘 풀 문제 모달 */}
      {showDailyQuiz && todayQuiz && (
        <DailyQuizModal
          quizData={todayQuiz}
          onSubmit={handleSubmitQuiz}
          onClose={() => setShowDailyQuiz(false)}
        />
      )}

      {/* 오늘 결과 모달 */}
      {showDailyResult && todayQuiz && (
        <DailyResultModal
          quizData={{
            description: todayQuiz.meaning,
            answer:    todayQuiz.word,
          }}
          userAnswer={""}   // 초기값: 아직 로컬에 없으므로 빈 문자열
          correct={false}   // 초기값
          username={nickname}
          onClose={() => setShowDailyResult(false)}
        />
      )}
    </>
  );
};

export default HomeWithDailyQuiz;
