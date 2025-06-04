import { useEffect, useState } from "react";
import Header from "../components/Header";

const QuizPage = ({
  isLoggedIn,
  setIsLoggedIn,
  nickname,
  wrongAnswersMap,
  setWrongAnswersMap,
}) => {
  const [data, setData] = useState([]);
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ 정적 JSON 파일 불러오기
  useEffect(() => {
    fetch("http://localhost:3000/idioms")
      .then((res) => res.json())
      .then((json) => {
        const quizData = generateQuiz(json, 10); // 원하는 문제 개수만큼
        setData(quizData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("퀴즈 데이터 로딩 실패:", err);
        setLoading(false);
      });
  }, []);

  // ✅ 정답 + 오답 3개 보기로 구성된 퀴즈 문제 만들기
  const generateQuiz = (allIdioms, count) => {
    const shuffled = [...allIdioms].sort(() => Math.random() - 0.5);
    const quizList = [];

    for (let i = 0; i < Math.min(count, shuffled.length); i++) {
      const correct = shuffled[i];
      const otherOptions = allIdioms
        .filter((item) => item.word !== correct.word)
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);

      const options = shuffle([correct.word, ...otherOptions.map((item) => item.word)]);

      quizList.push({
        description: correct.meaning,
        options,
        answer: correct.word,
      });
    }

    return quizList;
  };

  // ✅ 보기 순서 섞기
  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

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

  if (loading) return <div className="text-center mt-10">로딩 중...</div>;
  if (!current) return <div className="text-center mt-10">퀴즈가 없습니다.</div>;

  return (
    <div className="min-h-screen bg-[#f2f2f2] flex flex-col">
      <Header
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        setShowLoginModal={() => {}}
      />

      <div className="bg-white w-[95%] rounded-3xl shadow px-8 py-12 mx-auto my-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold">단어퀴즈</h1>
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

export default QuizPage;
