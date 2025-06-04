import { useState, useEffect } from "react";
import Header from "../components/Header";

const HanjaComboPage = ({ isLoggedIn, setIsLoggedIn }) => {
  const data = [
    {
      meaning: "같은 무리끼리 서로 내왕하며 사귐",
      answer: "類類相從",
      options: ["類", "類", "相", "從", "朋", "友", "有", "信"],
    },
    {
      meaning: "벗이 서로 마음이 잘 맞고 친함",
      answer: "朋友有信",
      options: ["朋", "友", "有", "信", "和", "合", "親", "切"],
    },
  ];

  const [index, setIndex] = useState(0);
  const [userInput, setUserInput] = useState([]); // 각 요소는 { char: "字", index: 숫자 }
  const [tries, setTries] = useState(0);
  const [feedback, setFeedback] = useState("");

  const current = data[index];
  const maxTries = 3;

  const handleSelect = (char, i) => {
    if (userInput.length >= 4) return;
    setUserInput([...userInput, { char, index: i }]);
  };

  const handleRemove = (i) => {
    const newInput = [...userInput];
    newInput.splice(i, 1);
    setUserInput(newInput);
    setFeedback("");
  };

  const goToNext = () => {
    setTimeout(() => {
      if (index < data.length - 1) {
        setIndex(index + 1);
        setUserInput([]);
        setTries(0);
        setFeedback("");
      } else {
        setFeedback("모든 문제를 풀었습니다!");
      }
    }, 1000);
  };

  const checkAnswer = () => {
    const answer = userInput.map((c) => c.char).join("");
    if (answer === current.answer) {
      setFeedback("정답입니다!");
      goToNext();
    } else {
      const newTries = tries + 1;
      setTries(newTries);
      if (newTries >= maxTries) {
        setFeedback("오답 기회를 모두 사용했습니다.");
        goToNext();
      } else {
        setFeedback("틀렸습니다. 다시 시도하세요.");
        setTimeout(() => {
          setUserInput([]);
          setFeedback("");
        }, 1000);
      }
    }
  };

  const isUsed = (i) => {
    return userInput.some((u) => u.index === i);
  };

  return (
    <div className="min-h-screen bg-[#f2f2f2] flex flex-col">
      <Header
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        setShowLoginModal={() => {}}
      />

      <div className="bg-white w-[95%] rounded-3xl shadow px-8 py-12 mx-auto my-6 text-center">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold">한자 조합</h1>
          <span className="text-sm font-bold">
            {index + 1}/{data.length}
          </span>
        </div>

        {/* 정답 입력칸 */}
        <div className="flex justify-center gap-4 mb-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              onClick={() => userInput[i] && handleRemove(i)}
              className="w-14 h-14 border rounded-md flex items-center justify-center text-2xl cursor-pointer bg-white"
            >
              {userInput[i]?.char || ""}
            </div>
          ))}
        </div>

        {/* 뜻 설명 */}
        <div className="border px-4 py-3 rounded-md bg-gray-50 mb-6 inline-block">
          {current.meaning}
        </div>

        {/* 피드백 */}
        {feedback && (
          <div className="mb-4 text-lg font-bold text-center text-red-500">
            {feedback}
          </div>
        )}

        {/* 선택지 */}
        <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
          {current.options.map((char, i) => (
            <button
              key={i}
              onClick={() => handleSelect(char, i)}
              disabled={isUsed(i) || (userInput.length >= 4 && !isUsed(i))}
              className="w-14 h-14 border rounded-md text-2xl bg-white hover:bg-gray-100 disabled:opacity-50"
            >
              {char}
            </button>
          ))}
        </div>

        {/* 정답 확인 버튼 */}
        {userInput.length === 4 && (
          <button
            onClick={checkAnswer}
            className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-full"
          >
            정답 확인
          </button>
        )}
      </div>
    </div>
  );
};

export default HanjaComboPage;
