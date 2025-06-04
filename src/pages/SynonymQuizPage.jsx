import { useState } from "react";
import Header from "../components/Header";

const SynonymQuizPage = ({ isLoggedIn, setIsLoggedIn, nickname = "guest", wrongAnswersMap = {}, setWrongAnswersMap = () => {} }) => {
  const data = [
    {
      hanja: "意氣投合",
      meaning: "뜻이 서로 맞아 마음이 통함",
      options: ["意氣投合", "朝令暮改", "無爲徒食", "支離滅裂"],
      answer: "意氣投合",
    },
    {
      hanja: "同苦同樂",
      meaning: "괴로움과 즐거움을 함께 나눔",
      options: ["異口同聲", "事必歸正", "同苦同樂", "五里霧中"],
      answer: "同苦同樂",
    },
  ];

  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const current = data[index];

  const handleClick = (option) => {
    if (option === current.answer) {
      setFeedback("정답입니다!");
    } else {
      setFeedback("틀렸습니다!");

      const existing = wrongAnswersMap[nickname] || [];
      const updatedMap = {
        ...wrongAnswersMap,
        [nickname]: [...existing, current],
      };
      setWrongAnswersMap(updatedMap);
    }

    setTimeout(() => {
      if (index < data.length - 1) {
        setIndex(index + 1);
        setFeedback("");
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#f2f2f2] flex flex-col">
      <Header
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        setShowLoginModal={() => {}}
      />

      <div className="bg-white w-[95%] rounded-3xl shadow px-8 py-12 mx-auto my-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold">유의어 퀴즈</h1>
          <span className="text-sm font-bold">
            {index + 1}/{data.length}
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
          <div className="text-2xl font-bold mb-2">{current.hanja}</div>
          <div className="text-sm">{current.meaning}</div>
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

export default SynonymQuizPage;
