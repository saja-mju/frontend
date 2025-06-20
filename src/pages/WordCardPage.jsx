import { useEffect, useState } from "react";
import Header from "../components/Header";

const WordCardPage = ({ isLoggedIn, setIsLoggedIn }) => {
  const [data, setData] = useState([]);
  const [index, setIndex] = useState(0);

  // ✅ JSON에서 데이터 fetch
  useEffect(() => {
    fetch("http://localhost:3000/idioms")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("사자성어 불러오기 실패:", err));
  }, []);

  const current = data[index];

  const prev = () => {
    if (index > 0) setIndex(index - 1);
  };

  const next = () => {
    if (index < data.length - 1) setIndex(index + 1);
  };

  // 로딩 처리
  if (!current) return <div className="text-center mt-10">로딩 중...</div>;

  return (
    <div className="min-h-screen bg-[#f2f2f2] flex flex-col">
      <Header
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        setShowLoginModal={() => {}}
      />

      <div className="bg-white w-[95%] rounded-3xl shadow px-8 py-12 mx-auto my-6 flex flex-col items-center justify-center">
        <h1 className="text-left text-lg font-semibold w-full mb-6">낱말카드</h1>

        <div className="flex items-center justify-center">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center mr-4 disabled:opacity-50"
            disabled={index === 0}
          >
            ◀
          </button>

          {/* ✅ 한자 카드 */}
          <div className="border-4 border-orange-300 bg-white w-80 h-40 rounded-2xl shadow-md flex items-center justify-center">
            <span className="text-3xl font-extrabold text-black">
              {current.word}
            </span>
          </div>

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

export default WordCardPage;
