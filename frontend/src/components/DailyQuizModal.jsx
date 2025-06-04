// src/components/DailyQuizModal.jsx
import { useState } from "react";

const DailyQuizModal = ({ quizData, onSubmit, onClose }) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (submitted || !userAnswer.trim()) return;
    onSubmit({ idiomId: quizData.id, userAnswer: userAnswer.trim() });
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-[90%] max-w-md p-6 shadow relative text-center">
        <button
          className="absolute top-3 right-4 text-xl"
          onClick={onClose}
        >
          ✖
        </button>

        <h2 className="text-xl font-bold mb-4">오늘의 퀴즈</h2>

        {/* 문제(뜻) */}
        <div className="border rounded-xl p-4 mb-6 whitespace-pre-line text-gray-800">
          {quizData?.meaning}
        </div>

        {/* 사용자 정답 입력란 */}
        <input
          type="text"
          placeholder="정답을 입력하세요"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          className="border rounded px-3 py-2 w-full mb-4 focus:outline-none focus:ring"
          disabled={submitted}
        />

        <button
          onClick={handleSubmit}
          className="mt-2 px-6 py-2 bg-blue-500 text-white rounded-full disabled:opacity-50"
          disabled={submitted || !userAnswer.trim()}
        >
          제출하기
        </button>
      </div>
    </div>
  );
};

export default DailyQuizModal;
