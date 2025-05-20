import { useState } from "react";

const LearnPage = () => {
  const data = [
    {
      hanja: "四字成語",
      title: "사자성어",
      description: "한자 네 자로 이루어진 성어.\n교훈이나 유래를 담고 있다.",
    },
  ];

  const [index, setIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // ✅ 로그인 상태
  const current = data[index];

  const prev = () => {
    if (index > 0) setIndex(index - 1);
  };

  const next = () => {
    if (index < data.length - 1) setIndex(index + 1);
  };

  return (
    <div className="min-h-screen bg-[#f2f2f2] flex flex-col">
      {/* ✅ 공통 헤더 */}
      <header className="flex justify-between items-center px-6 py-4 bg-white shadow-sm">
        <div className="text-sm">학습하기 ▼</div>
        <div
          className="text-sm cursor-pointer"
          onClick={() => setIsLoggedIn(!isLoggedIn)}
        >
          {isLoggedIn ? "로그아웃" : "로그인"}
        </div>
      </header>

      {/* ✅ 90~95% 너비의 둥근 흰색 박스 */}
      <div className="bg-white w-[95%] rounded-3xl shadow px-8 py-12 mx-auto my-6 flex flex-col items-center justify-center">
        {/* 제목 */}
        <h1 className="text-left text-lg font-semibold w-full mb-6">
          학습하기
        </h1>

        {/* 카드 + 버튼 */}
        <div className="flex items-center justify-center">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center mr-4 disabled:opacity-50"
            disabled={index === 0}
          >
            ◀
          </button>

          <div className="bg-red-400 w-80 rounded-2xl shadow-md p-6 text-white flex flex-col items-center">
            <div className="bg-white text-black w-full text-center py-6 text-2xl font-extrabold rounded-lg mb-4">
              {current.hanja}
            </div>
            <div className="text-lg font-bold mb-2">{current.title}</div>
            <p className="text-sm whitespace-pre-line text-white text-center">
              {current.description}
            </p>
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

export default LearnPage;
