import { useState, useEffect } from "react";

const DailyQuizModal = ({ onClose, onSubmit }) => {
  const quiz = {
    question: "한자 네 자로 이루어진 성어.\n교훈이나 유래를 담고 있다.",
    options: ["사자성어", "일석이조", "어부지리", "오매불망"],
    answer: "사자성어",
  };

  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  const handleSelect = (option) => {
    if (submitted) return;
    setSelected(option);
  };

  const handleSubmit = () => {
    if (!selected) return;
    const correct = selected === quiz.answer;
    setResult(correct ? "correct" : "wrong");
    setSubmitted(true);
    setTimeout(() => {
      onSubmit(correct);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-[90%] max-w-md p-6 shadow relative text-center">
        <h2 className="text-xl font-bold mb-4">오늘의 퀴즈</h2>

        <div className="border rounded-xl p-4 mb-6 whitespace-pre-line text-gray-800">
          {quiz.question}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {quiz.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelect(opt)}
              className={`border rounded-xl py-2 px-3 text-sm font-medium transition-all duration-200 ${
                submitted && opt === quiz.answer
                  ? "bg-green-200 border-green-400"
                  : selected === opt
                  ? "bg-blue-100 border-blue-300"
                  : "bg-white hover:bg-gray-100"
              }`}
              disabled={submitted}
            >
              {opt}
            </button>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-full disabled:opacity-50"
          disabled={submitted || selected === null}
        >
          제출하기
        </button>
      </div>
    </div>
  );
};

export default DailyQuizModal;
