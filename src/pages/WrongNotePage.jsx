// src/pages/WrongNotePage.jsx
import { useState } from "react";
import Header from "../components/Header";

const WrongNotePage = ({ isLoggedIn, setIsLoggedIn, nickname, wrongAnswersMap }) => {
  const wrongAnswers = wrongAnswersMap[nickname] || [];
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const current = wrongAnswers[index];

  const handleClick = (option) => {
    if (option === current.answer) {
      setFeedback("정답입니다!");
    } else {
      setFeedback("틀렸습니다!");
    }

    setTimeout(() => {
      if (index < wrongAnswers.length - 1) {
        setIndex(index + 1);
        setFeedback("");
      }
    }, 800);
  };

  if (wrongAnswers.length === 0) {
    return (
      <div className="min-h-screen bg-[#f2f2f2] flex flex-col">
        <Header
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          setShowLoginModal={() => {}}
        />
        <div className="w-full text-center mt-32 text-lg text-gray-600 font-semibold">
          오답이 없습니다.
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
          <h1 className="text-lg font-semibold">오답노트</h1>
          <span className="text-sm font-bold">
            {index + 1}/{wrongAnswers.length}
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
          {current.description}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {current.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleClick(option)}
              className="border rounded-xl py-3 text-center text-black hover:bg-gray-100 transition"
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WrongNotePage;
