// src/pages/SynonymQuizPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const SynonymQuizPage = ({
  isLoggedIn,
  setIsLoggedIn,
  nickname,
  wrongAnswersMap,
  setWrongAnswersMap,
}) => {
  const navigate = useNavigate();

  // ────────── State 정의 ───────────────────────
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);           // [{ word, isCorrect }, …]
  const [selectedIndices, setSelectedIndices] = useState([]); // 여러 개 토글
  const [feedback, setFeedback] = useState("");          // “정답입니다!” / “틀렸습니다!”
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [score, setScore] = useState(0);  // 처음엔 0점부터 시작

  

  // ────────── 퀴즈 Fetch ───────────────────────
  useEffect(() => {
    if (!isLoggedIn || !nickname) {
      navigate("/");
      return;
    }

    const fetchQuiz = async () => {
      try {
        setLoading(true);
        setError("");
        setQuestion(null);
        setOptions([]);
        setSelectedIndices([]);
        setFeedback("");
        setSubmitted(false);

        const res = await fetch(
          `http://localhost:3000/results/synonym-quiz/${nickname}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "문제를 불러오는 데 실패했습니다.");
        }
        const data = await res.json();
        // data = { question: { id, word, meaning }, options: […], correctAnswers: […] }
        setQuestion(data.question);
        setOptions(data.options);
      } catch (err) {
        console.error("유의어 퀴즈 불러오기 오류:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [isLoggedIn, nickname, navigate]);

  // ────────── 보기 클릭(토글) 핸들러 ─────────────────
  const handleChoiceClick = (idx) => {
    if (submitted) return; // 한 번 제출(submit)되면 더 이상 토글 금지
    if (selectedIndices.includes(idx)) {
      // 이미 선택된 인덱스면 제거
      setSelectedIndices(prev => prev.filter((i) => i !== idx));
    } else {
      // 선택되지 않은 인덱스면 새로 추가
      setSelectedIndices(prev => [...prev, idx]);
    }
  };

  // ────────── 정답 제출 핸들러 ───────────────────
  const handleSubmit = async () => {
    if (selectedIndices.length === 0) {
      alert("하나 이상의 보기를 선택해주세요.");
      return;
    }
    if (!question) return;

    try {
      // “정답”: options 배열 중 isCorrect=true인 word들을 모아 Set 생성
      const correctSet = new Set(
        options.filter((opt) => opt.isCorrect).map((opt) => opt.word)
      );
      // “사용자 선택”: selectedIndices로 선택된 word들을 Set 생성
      const chosenWords = selectedIndices.map((i) => options[i].word);
      const selectedSet = new Set(chosenWords);

      // “두 집합이 정확히 일치하는지” 검사
      let isCorrectAll = true;
      if (correctSet.size !== selectedSet.size) {
        isCorrectAll = false;
      } else {
        for (let w of correctSet) {
          if (!selectedSet.has(w)) {
            isCorrectAll = false;
            break;
          }
        }
      }

      // 서버에 제출할 때는 “선택된 단어 문자열 배열”만 보내면 됩니다
      const payload = {
        username: nickname,
        idiomId: question.id,
        selectedWords: chosenWords,
      };

      const res = await fetch("http://localhost:3000/results/synonym-quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "정답 제출에 실패했습니다.");
      }

      setSubmitted(true);
      setFeedback(isCorrectAll ? "정답입니다!" : "틀렸습니다!");

    if (isCorrectAll) {
      setScore((prev) => prev + 20);
    }

      // 틀렸으면 클라이언트 측 오답노트에도 추가
      if (!isCorrectAll) {
        const existing = wrongAnswersMap[nickname] || [];
        setWrongAnswersMap({
          ...wrongAnswersMap,
          [nickname]: [...existing, question],
        });
      }
    } catch (err) {
      console.error("유의어퀴즈 정답 제출 오류:", err);
      alert(err.message);
    }
  };

  // ────────── 다음 문제 요청 핸들러 ───────────────────
  const handleNextQuestion = async () => {
    setLoading(true);
    setError("");
    setQuestion(null);
    setOptions([]);
    setSelectedIndices([]);
    setFeedback("");
    setSubmitted(false);

    try {
      const res = await fetch(
        `http://localhost:3000/results/synonym-quiz/${nickname}`,
        { method: "GET", credentials: "include" }
      );
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "문제를 불러오는 데 실패했습니다.");
      }
      const data = await res.json();
      setQuestion(data.question);
      setOptions(data.options);
    } catch (err) {
      console.error("유의어퀴즈 불러오기 오류:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ────────── 렌더링 ─────────────────────────────
  if (loading) {
    return (
      <div className="p-6 text-center">
        <p>문제를 불러오는 중...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">에러: {error}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleNextQuestion}
        >
          다시 시도
        </button>
      </div>
    );
  }
  if (!question) {
    return null;
  }
  // (1) 제출 전 화면: “다중 선택” UI
  if (!submitted) {
    return (
      <div className="h-screen bg-[#f2f2f2] flex flex-col">
        <Header
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          setShowLoginModal={() => {}}
        />
        <div className="bg-white w-[95%] h-[95%] rounded-3xl shadow px-8 py-12 mx-auto my-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-lg font-semibold">유의어 퀴즈</h1>
            <span className="text-sm font-bold">score : {score}</span>
          </div>

          <div className="border rounded-xl p-6 min-h-[120px] whitespace-pre-line text-center text-gray-800 mb-6">
            <div className="text-2xl font-bold mb-2">{question.word}</div>
            <div className="text-sm">{question.meaning}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleChoiceClick(idx)}
                className={`border rounded-xl py-3 text-center text-black hover:bg-gray-100 transition ${
                  selectedIndices.includes(idx)
                    ? "bg-blue-200 border-blue-500"
                    : "bg-gray-50"
                }`}
              >
                {opt.word}
              </button>
            ))}
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              정답 제출
            </button>
          </div>
        </div>
      </div>
    );
  }

  // (2) 제출 후 피드백 화면
  return (
    <div className="min-h-screen bg-[#f2f2f2] flex flex-col">
      <Header
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        setShowLoginModal={() => {}}
      />
      <div className="bg-white w-[95%] rounded-3xl shadow px-8 py-12 mx-auto my-6 text-center">
        <h1 className="text-xl font-bold mb-4">결과</h1>
        <p
          className={`mb-4 text-lg font-semibold ${
            feedback === "정답입니다!" ? "text-green-600" : "text-red-500"
          }`}
        >
          {feedback}
        </p>
        {feedback !== "정답입니다!" && (
          <p className="mb-4 text-sm text-gray-600">
            정답:{" "}
            {options
              .filter((opt) => opt.isCorrect)
              .map((opt) => opt.word)
              .join(", ")}
          </p>
        )}
        <button
          onClick={handleNextQuestion}
          className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          다음 문제
        </button>
      </div>
    </div>
  );
};

export default SynonymQuizPage;

