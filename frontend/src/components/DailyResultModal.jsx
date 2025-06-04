// src/components/DailyResultModal.jsx
import React, { useEffect, useState } from "react";
import CalendarModal from "./CalendarModal";

const DailyResultModal = ({
  onClose,
  quizData,     // { description, answer }
  username      // 로그인된 사용자명
}) => {
  const [history, setHistory] = useState([]); // ["2025-06-01", "2025-06-02", …]
  const [storedResult, setStoredResult] = useState({
    description: "",
    correctWord: "",
    userAnswer:  "",
    isCorrect:   false,
  });

  // 1) 달력용 날짜 이력 불러오기
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/results/daily-history/${username}`,
          { method: "GET", credentials: "include" }
        );
        if (!res.ok) throw new Error("fetch history failed");
        const data = await res.json();
        // data = { dates: ["2025-06-01", …] }
        setHistory(data.dates || []);
      } catch (err) {
        console.error("getDailyHistory error:", err);
      }
    };
    fetchHistory();
  }, [username]);

  // 2) 오늘 풀었던 문제의 상세 결과 불러오기
  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/results/daily-result/${username}`,
          { method: "GET", credentials: "include" }
        );
        if (!res.ok) {
          // 404 등 오류면 아직 풀지 않은 상태이므로 무시
          return;
        }
        const data = await res.json();
        // data = { idiomId, correctWord, meaning, userAnswer, isCorrect }
        setStoredResult({
          description: data.meaning,
          correctWord: data.correctWord,
          userAnswer:  data.userAnswer,
          isCorrect:   data.isCorrect,
        });
      } catch (err) {
        console.error("getDailyResult error:", err);
      }
    };
    fetchResult();
  }, [username]);

  // 화면에 보여줄 값: 서버에서 받아온 storedResult를 우선 사용
  const desc = storedResult.description || quizData?.description || "";
  const corr = storedResult.correctWord  || quizData?.answer      || "";
  const usr  = storedResult.userAnswer   || "";
  const isCorr = storedResult.isCorrect;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[90%] max-w-xl p-6 shadow-lg relative">
        <button
          className="absolute top-3 right-4 text-xl"
          onClick={onClose}
        >
          ✖
        </button>

        <h2 className="text-xl font-bold mb-4">오늘의 문제 결과</h2>

        <div className="mb-6">
          <p className="font-semibold mb-2">문제(뜻):</p>
          <div className="bg-gray-100 rounded p-3 text-left">
            {desc}
          </div>

          <p className="font-semibold mt-4">정답:</p>
          <div className="text-green-600">{corr}</div>

          <p className="font-semibold mt-4">내가 적은 답:</p>
          <div className={isCorr ? "text-green-600" : "text-red-500"}>
            {usr || "선택 없음"}
          </div>

          <p className="mt-2">
            {isCorr ? "🎉 정답을 맞히셨습니다!" : "😢 아쉽지만 오답입니다."}
          </p>
        </div>

        <h3 className="text-lg font-semibold mb-2">내가 풀었던 날들</h3>
        <CalendarModal quizHistory={history} />
      </div>
    </div>
  );
};

export default DailyResultModal;
