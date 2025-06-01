import { useEffect, useState } from "react";
import Header from "../components/Header";

const LearnPage = ({ isLoggedIn, setIsLoggedIn }) => {
  const [data, setData] = useState([]);
  const [index, setIndex] = useState(0);

  // ✅ 1. JSON 데이터 가져오기
  useEffect(() => {
    fetch("http://localhost:3000/idioms")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("사자성어 데이터 로딩 실패:", err));
  }, []);

  const current = data[index];

  const prev = () => {
    if (index > 0) setIndex(index - 1);
  };

  const next = () => {
    if (index < data.length - 1) setIndex(index + 1);
  };

  // ✅ 2. 데이터 로딩 중 처리
  if (!current) return <div className="text-center mt-10">로딩 중...</div>;

  return (
    <div className="min-h-screen bg-[#f2f2f2] flex flex-col">
      <Header
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        setShowLoginModal={() => {}}
      />

      <div className="bg-white w-[95%] rounded-3xl shadow px-8 py-12 mx-auto my-6 flex flex-col items-center justify-center">
        <h1 className="text-left text-lg font-semibold w-full mb-6">학습하기</h1>

        <div className="flex items-center justify-center">
          {/* ◀ 이전 버튼 */}
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center mr-4 disabled:opacity-50"
            disabled={index === 0}
          >
            ◀
          </button>

          {/* ✅ 학습 카드 */}
          <div className="bg-red-400 w-80 rounded-2xl shadow-md p-6 text-white flex flex-col items-center">
            {/* 한자 박스 */}
            <div className="bg-white text-black w-full h-20 rounded-lg mb-4 flex items-center justify-center">
              <span className="text-2xl font-extrabold">{current.word}</span>
            </div>

            {/* 설명 */}
            <p className="text-sm whitespace-pre-line text-white text-center mb-2">
              {current.meaning}
            </p>

            {/* 난이도 표시 */}
            <span className="text-xs text-white bg-black px-2 py-1 rounded-full">
              난이도: {current.difficulty}
            </span>
          </div>

          {/* ▶ 다음 버튼 */}
          <button
            onClick={next}
            className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center ml-4 disabled:opacity-50"
            disabled={index === data.length - 1}
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearnPage;
