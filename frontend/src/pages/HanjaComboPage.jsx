// src/pages/HanjaComboPage.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const HanjaComboPage = ({
  isLoggedIn,
  setIsLoggedIn,
  nickname,
  wrongAnswersMap,
  setWrongAnswersMap,
}) => {
  const navigate = useNavigate();

  // ───────────────── 상태 정의 ─────────────────
  const [question, setQuestion] = useState(null);
  // question = { id, meaning, wordLength }
  const [options, setOptions] = useState([]);            // 8개의 한자 보기
  const [correctAnswer, setCorrectAnswer] = useState([]); // ["類","類","相","從"]
  const [userInput, setUserInput] = useState([]);         // [{ char, index }, …]
  const [tries, setTries] = useState(0);                  // 현재 오답 시도 횟수
  const [feedback, setFeedback] = useState("");           // "정답입니다!" / "틀렸습니다!" / "기회 소진"
  const [showCorrectNow, setShowCorrectNow] = useState(false); // 정답 표시 여부
  const [loading, setLoading] = useState(true);           // 문제 로딩 중
  const [error, setError] = useState("");                 // 에러 메시지
  const [score, setScore] = useState(0);


  const maxTries = 3; // 최대 시도 횟수

  // ───────────────── 문제 API 호출(useEffect) ─────────────────
  useEffect(() => {
    if (!isLoggedIn || !nickname) {
      // 로그인 안 되어 있으면 홈으로 돌려보냄
      navigate("/");
      return;
    }

    
  // 현재 점수 불러오기
  const fetchScore = async () => {
    try {
      const res = await fetch(`http://localhost:3000/results/getScore?username=${nickname}`);
      if (!res.ok) throw new Error("점수를 불러오는 데 실패했습니다.");
      const data = await res.json();
      setScore(data.score); // 초기 점수 세팅
    } catch (err) {
      console.error("점수 불러오기 오류:", err);
    }
  };


    const fetchQuiz = async () => {
      try {
        setLoading(true);
        setError("");
        setQuestion(null);
        setOptions([]);
        setCorrectAnswer([]);
        setUserInput([]);
        setTries(0);
        setFeedback("");
        setShowCorrectNow(false);

        // 백엔드 GET /results/hanja-quiz/:username
        const res = await fetch(
          `http://localhost:3000/results/hanja-quiz/${nickname}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "문제를 불러오는 데 실패했습니다.");
        }
        const data = await res.json();
        console.log("🚀 [getHanjaQuiz 응답 데이터]", data);

        // 백엔드 응답 스키마에 맞춰 상태 세팅
        setQuestion(data.question);
        setOptions(data.hanjaOptions);
        setCorrectAnswer(data.correctAnswer);
      } catch (err) {
        console.error("한자 퀴즈 불러오기 오류:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [isLoggedIn, nickname, navigate]);

  // ───────────────── 보기(한자) 클릭 함수 및 중복 방지 ─────────────────
  const isUsed = (i) => {
    return userInput.some((u) => u.index === i);
  };

  const handleSelect = (char, i) => {
    if (!question || userInput.length >= question.wordLength) return;
    if (isUsed(i)) return;
    setUserInput((prev) => [...prev, { char, index: i }]);
    setFeedback("");
  };

  // ───────────────── 선택된 글자 삭제(입력칸 클릭 시) ─────────────────
  const handleRemove = (i) => {
    const newInput = [...userInput];
    newInput.splice(i, 1);
    setUserInput(newInput);
    setFeedback("");
  };

  // ───────────────── 정답 확인(제출) 함수 ─────────────────
  const checkAnswer = async () => {
    if (!question) return;
    const answerStr = userInput.map((u) => u.char).join("");
    const correctStr = correctAnswer.join("");

    // 1) 정답일 때
    if (answerStr === correctStr) {
      setFeedback("정답입니다!");
      setShowCorrectNow(true); // 정답도 잠시 보여줄 수 있음
      await submitAnswer(true);
      goToNext();
      return;
    }

    // 2) 오답일 때
    const newTries = tries + 1;
    setTries(newTries);

    // 2-1) 기회가 남은 경우
    if (newTries < maxTries) {
      setFeedback(`틀렸습니다. (${newTries}/${maxTries})`);
      // 잠시 후 다시 입력칸 지우고 재시도
      setTimeout(() => {
        setUserInput([]);
        setFeedback("");
      }, 1000);
      await submitAnswer(false);
      return;
    }

    // 2-2) 기회 모두 소진한 경우
    setFeedback("오답 기회를 모두 사용했습니다.");
    setShowCorrectNow(true); // 정답 표시 플래그 켜기
    await submitAnswer(false);
    // 👉 정답을 2.5초 보여준 후 다음 문제로 이동
    setTimeout(() => {
      goToNext();
    }, 2500);
      };

  // ───────────────── 서버에 채점 결과 전송 ─────────────────
  const submitAnswer = async (isCorrect) => {
    try {
      const payload = {
        username: nickname,
        idiomId: question.id,
        selected: userInput.map((u) => u.char),
      };
      const res = await fetch("http://localhost:3000/results/hanja-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error("한자 퀴즈 제출 오류:", errData);
      }
          // ✅ 여기 아래에 점수 올리기 추가!
        if (isCorrect) {
          setScore((prev) => prev + 30);
        }
      // 오답일 경우 클라이언트 오답노트에도 추가
      if (!isCorrect) {
        const existing = wrongAnswersMap[nickname] || [];
        setWrongAnswersMap({
          ...wrongAnswersMap,
          [nickname]: [...existing, question],
        });
      }
    } catch (err) {
      console.error("한자 퀴즈 제출 중 네트워크 오류:", err);
    }
  };

  // ───────────────── 다음 문제 로딩 ─────────────────
  const goToNext = () => {
    setTimeout(async () => {
      try {
        setLoading(true);
        setError("");
        setQuestion(null);
        setOptions([]);
        setCorrectAnswer([]);
        setUserInput([]);
        setTries(0);
        setFeedback("");
        setShowCorrectNow(false);

        const res = await fetch(
          `http://localhost:3000/results/hanja-quiz/${nickname}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "문제를 불러오는 데 실패했습니다.");
        }
        const data = await res.json();
        console.log("🚀 [다음 getHanjaQuiz 응답 데이터]", data);

        setQuestion(data.question);
        setOptions(data.hanjaOptions);
        setCorrectAnswer(data.correctAnswer);
      } catch (err) {
        console.error("다음 한자 퀴즈 불러오기 오류:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  // ───────────────── 렌더링 ─────────────────

  // (1) 로딩 중
  if (loading) {
    return (
      <div className="p-6 text-center">
        <p>문제를 불러오는 중...</p>
      </div>
    );
  }

  // (2) 에러가 있으면 에러 표시
  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">에러: {error}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => {
            // 간단히 새로고침으로 재시도
            window.location.reload();
          }}
        >
          다시 시도
        </button>
      </div>
    );
  }

  // (3) question 또는 옵션 배열이 준비되지 않으면 null 리턴
  if (!question || !Array.isArray(options) || !Array.isArray(correctAnswer)) {
    console.log("❗ 아직 준비되지 않음:", { question, options, correctAnswer });
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f2f2f2] flex flex-col">
      <Header
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        setShowLoginModal={() => {}}
      />

      <div className="bg-white w-[95%] h-[95%]rounded-3xl shadow px-8 py-12 mx-auto my-6 text-center">
        {/* 상단: 페이지 제목 & 문제 번호(ID) */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold">한자 조합</h1>
          <span className="text-sm font-bold">score : {score}</span>
        </div>

        {/* 입력칸: 네 개 칸, 클릭 시 해당 글자 삭제 */}
        <div className="flex justify-center gap-4 mb-4">
          {Array.from({ length: question.wordLength }).map((_, i) => (
            <div
              key={i}
              onClick={() => {
                if (userInput[i]) handleRemove(i);
              }}
              className="w-14 h-14 border rounded-md flex items-center justify-center text-2xl cursor-pointer bg-white"
            >
              {userInput[i]?.char || ""}
            </div>
          ))}
        </div>

        {/* 문제 설명(뜻) */}
        <div className="border px-4 py-3 rounded-md bg-gray-50 mb-6 inline-block">
          {question.meaning}
        </div>

        {/* 피드백: 정답/틀림/기회 소진 메시지 */}
        {feedback && (
          <div className="mb-4 text-lg font-bold text-center text-red-500">
            {feedback}
          </div>
        )}

        {/* (추가) 정답을 즉시 보여줘야 할 때 */}
        {showCorrectNow && (
          <div className="mb-4 text-center">
            <span className="text-blue-600 font-semibold">정답: </span>
            <span className="text-2xl tracking-widest">
              {correctAnswer.join("")}
            </span>
          </div>
        )}

        {/* 보기(총 8개) */}
        <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
          {options.map((char, i) => (
            <button
              key={i}
              onClick={() => handleSelect(char, i)}
              disabled={
                isUsed(i) ||
                (userInput.length >= question.wordLength && !isUsed(i))
              }
              className="w-14 h-14 border rounded-md text-2xl bg-white hover:bg-gray-100 disabled:opacity-50"
            >
              {char}
            </button>
          ))}
        </div>

        {/* “정답 확인” 버튼 (네 글자 모두 채웠을 때만 표시) */}
        {userInput.length === question.wordLength && (
          <button
            onClick={checkAnswer}
            className="mt-6 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            정답 확인
          </button>
        )}
      </div>
    </div>
  );
};

export default HanjaComboPage;




