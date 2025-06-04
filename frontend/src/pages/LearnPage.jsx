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
    <div className="h-screen bg-[#f2f2f2] flex flex-col">
      <Header
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        setShowLoginModal={() => {}}
      />

      <div className="bg-white w-[95%] h-[95%] rounded-3xl shadow px-8 pt-6 pb-12 mx-auto my-6 flex flex-col items-center">
        
        <div className="w-full flex justify-between items-center mb-6 pb-24">
          <h1 className="text-lg font-semibold">학습하기</h1>
          <span className="text-sm font-semibold text-black">{index + 1}/{data.length}</span>
        </div>
        

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
          <div className="bg-red-400 w-[600px] h-[350px] rounded-2xl shadow-md p-6 text-white flex flex-col items-center justify-between">
            {/* 한자 박스 */}
            <div className="bg-white text-black w-full h-20 rounded-lg flex items-center justify-center">
              <span className="text-4xl font-extrabold">{current.word}</span>
            </div>

            {/* 설명 */}
            <p className="text-lg text-white text-center overflow-hidden text-ellipsis h-[150px]">
              <p className="font-extrabold pb-2">{current.reading}</p>{current.meaning}
            </p>

            {/* 난이도 표시 */}
            <span className="text-sm text-black bg-white px-2 py-1 rounded-full">
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
