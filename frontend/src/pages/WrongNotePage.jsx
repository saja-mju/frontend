// src/pages/WrongNotePage.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";

function useQuery() {
  // URL 쿼리 스트링을 파싱해서 객체로 반환하는 커스텀 훅
  return new URLSearchParams(useLocation().search);
}

const WrongNotePage = ({ isLoggedIn, setIsLoggedIn, nickname }) => {
  const navigate = useNavigate();
  const query = useQuery();
  const mode = query.get("mode") || "basic"; // 쿼리에 mode가 없으면 기본 'basic'

  // 백엔드 API에서 받아온 오답목록: [{ id, word, reading, meaning }, ...]
  const [wrongRows, setWrongRows] = useState([]);
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState("");

  // 첫 렌더링 시 (혹은 mode가 바뀔 때) API 호출
  useEffect(() => {
    if (!isLoggedIn) {
      // 로그인하지 않은 상태면 홈으로 리다이렉트
      navigate("/");
      return;
    }

    const fetchWrong = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/results/wrong/${nickname}?mode=${mode}`,
          {
            method: "GET",
            credentials: "include", // 세션 쿠키 포함
          }
        );
        if (!res.ok) {
          throw new Error("오답노트 데이터를 가져오지 못했습니다.");
        }
        const data = await res.json();
        // data는 배열 [{ id, word, reading, meaning }, ...]
        setWrongRows(data);
        setIndex(0);
        setFeedback("");
      } catch (err) {
        console.error("오답노트 조회 오류:", err);
      }
    };

    fetchWrong();
  }, [mode, nickname, isLoggedIn, navigate]);

  // “틀린 문제” 객체 하나를 렌더링하기 위한 현재 항목
  const current = wrongRows[index];

  const handleNext = () => {
    setFeedback(""); 
    if (index < wrongRows.length - 1) {
      setIndex(index + 1);
    }
  };

  if (!isLoggedIn) {
    return null; // 이미 useEffect에서 redirect 처리했으므로 여기서는 아무것도 안 보여 줘도 됩니다.
  }

  if (wrongRows.length === 0) {
    return (
      <div className="min-h-screen bg-[#f2f2f2] flex flex-col">
        <Header
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          setShowLoginModal={() => {}}
        />
        <div className="w-full text-center mt-32 text-lg text-gray-600 font-semibold">
          "{mode}" 모드의 오답이 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f2f2] flex flex-col">
      <Header
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        setShowLoginModal={() => {}}
      />

      <div className="bg-white w-[95%] rounded-3xl shadow px-8 py-12 mx-auto my-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold">오답노트 ({mode})</h1>
          <span className="text-sm font-bold">
            {index + 1}/{wrongRows.length}
          </span>
        </div>

        {feedback && (
          <div
            className={`text-center mb-4 text-lg font-bold ${
              feedback === "정답입니다!" ? "text-green-600" : "text-red-500"
            }`}
          >
            {feedback}
          </div>
        )}

        <div className="border rounded-xl p-6 min-h-[120px] whitespace-pre-line text-center text-gray-800 mb-6">
          {/* 예시: current.word (사자성어), current.meaning (뜻), 
              current.reading이 필요한 경우 표시해 주면 됩니다. */}
          <div className="text-2xl font-bold mb-2">{current.word}</div>
          <div className="text-sm text-gray-600">{current.reading}</div>
          <div className="mt-2">{current.meaning}</div>
        </div>

        <div className="flex justify-center gap-4">
          {/* 오답노트 화면에서는 정답/오답 선택 버튼 대신
              그냥 “다음” 버튼만 보여 줘도 됩니다. */}
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            다음
          </button>
        </div>
      </div>
    </div>
  );
};

export default WrongNotePage;




