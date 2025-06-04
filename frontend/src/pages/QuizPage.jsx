// src/pages/QuizPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const QuizPage = ({
  isLoggedIn,
  setIsLoggedIn,
  nickname,
  wrongAnswersMap,
  setWrongAnswersMap,
}) => {
  const navigate = useNavigate();

  // ────────── 1) State 정의 ──────────
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);      // [{ word, isCorrect }, …]
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [feedback, setFeedback] = useState("");     // "정답입니다!" or "틀렸습니다!"
  const [submitted, setSubmitted] = useState(false); // 정답 제출 여부
  const [loading, setLoading] = useState(true);    // 문제 불러오는 중 표시
  const [error, setError] = useState("");           // 오류 메시지
  const [score, setScore] = useState(0);



  // ────────── 2) 컴포넌트 마운트 시 퀴즈 문제 Fetch ──────────
  useEffect(() => {
    // 로그인 안 된 상태면 홈으로 강제 이동
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
        setSelectedIndex(null);
        setFeedback("");
        setSubmitted(false);

        // 백엔드 GET /results/basic-quiz/:username
        const res = await fetch(`http://localhost:3000/results/basic-quiz/${nickname}`, {
          method: "GET",
          credentials: "include", // 세션쿠키 포함
        });

        if (!res.ok) {
          // 실패 시, JSON으로 메시지를 받을 수도 있으니 시도
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "문제를 불러오는 데 실패했습니다.");
        }

        const data = await res.json();
        // data 형식 예시:
        // {
        //   question: { id: 123, meaning: "힌트 문장", total: 599 },
        //   options: [
        //     { word: "사자성어", isCorrect: true },
        //     { word: "일석이조", isCorrect: false },
        //     { word: "어부지리", isCorrect: false },
        //     { word: "오매불망", isCorrect: false }
        //   ]
        // }
        setQuestion(data.question);
        setOptions(data.options);
      } catch (err) {
        console.error("퀴즈 불러오기 오류:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [isLoggedIn, nickname, navigate]);

  // ────────── 3) 보기 클릭 핸들러 ──────────
  const handleChoiceClick = (idx) => {
    if (submitted) return; // 이미 제출한 후라면 무시
    setSelectedIndex(idx);
  };

  // ────────── 4) 정답 제출 핸들러 ──────────
  const handleSubmit = async () => {
    if (selectedIndex === null) {
      alert("보기를 선택해주세요.");
      return;
    }
    if (!question) return;

    try {
      const isCorrect = options[selectedIndex].isCorrect;

      const payload = {
        username: nickname,
        idiomId: question.id,
        isCorrect,
      };

      // 백엔드 POST /results/submit-basic
      const res = await fetch("http://localhost:3000/results/submit-basic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        // 오류 메시지가 JSON으로 올 수도 있으니 시도
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "정답 제출에 실패했습니다.");
      }

      // 제출이 성공했으므로, 피드백 처리
      setSubmitted(true);
      setFeedback(isCorrect ? "정답입니다! 🎉" : "틀렸습니다! 😢");

      if (isCorrect) {
        setScore((prev) => prev + 10);
      }

      // 틀렸다면 클라이언트 측 wrongAnswersMap에도 추가
      if (!isCorrect) {
        const existing = wrongAnswersMap[nickname] || [];
        const updatedMap = {
          ...wrongAnswersMap,
          [nickname]: [...existing, question],
        };
        setWrongAnswersMap(updatedMap);
      }
    } catch (err) {
      console.error("정답 제출 오류:", err);
      alert(err.message);
    }
  };

  // ────────── 5) 다음 문제 로딩 핸들러 ──────────
  const handleNextQuestion = () => {
    // 상태 초기화 후, fetchQuiz를 다시 호출하는 방식
    setLoading(true);
    setError("");
    setQuestion(null);
    setOptions([]);
    setSelectedIndex(null);
    setFeedback("");
    setSubmitted(false);

    (async () => {
      try {
        const res = await fetch(`http://localhost:3000/results/basic-quiz/${nickname}`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "문제를 불러오는 데 실패했습니다.");
        }
        const data = await res.json();
        setQuestion(data.question);
        setOptions(data.options);
      } catch (err) {
        console.error("퀴즈 불러오기 오류:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  };

  // ────────── 6) 렌더링 ──────────

  // 6-1. 로딩 중
  if (loading) {
    return (
      <div className="p-6 text-center">
        <p>문제를 불러오는 중...</p>
      </div>
    );
  }

  // 6-2. 에러 발생 시
  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">에러: {error}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => {
            handleNextQuestion(); // 다시 시도
          }}
        >
          다시 시도
        </button>
      </div>
    );
  }

  // 6-3. question 데이터가 없으면 아무것도 렌더링하지 않음
  if (!question) {
    return null;
  }

  // 6-4. 문제 화면 (아직 정답 제출 전)
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
            <h1 className="text-lg font-semibold">단어퀴즈</h1>
            <span className="text-sm font-bold">
              score : {score}
            </span>
          </div>

          <div className="border rounded-xl p-6 min-h-[120px] whitespace-pre-line text-center text-gray-800 mb-6">
            {question.meaning}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleChoiceClick(idx)}
                className={`border rounded-xl py-3 text-center text-black hover:bg-gray-100 transition ${
                  selectedIndex === idx
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

  // 6-5. 제출 후 피드백 화면
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
            feedback === "정답입니다! 🎉" ? "text-green-600" : "text-red-500"
          }`}
        >
          {feedback}
        </p>
        {feedback !== "정답입니다! 🎉" && (
          <p className="mb-4 text-sm text-gray-600">
            정답: {options.find((opt) => opt.isCorrect).word}
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

export default QuizPage;


