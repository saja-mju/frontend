import { useState } from "react";
import Header from "../components/Header";

const RankingPage = ({ isLoggedIn, setIsLoggedIn }) => {
  const categories = [
    { id: "all", label: "전체", tag: "ALL" },
    { id: "quiz", label: "단어퀴즈", tag: "가나" },
    { id: "synonym", label: "유의어퀴즈", tag: "漢字" },
    { id: "combo", label: "한자조합", tag: "漢" },
  ];

  const sampleRankings = {
    all: [
      { nickname: "홍길동", score: 970 },
      { nickname: "김철수", score: 900 },
      { nickname: "이영희", score: 880 },
    ],
    quiz: [
      { nickname: "단어왕", score: 999 },
      { nickname: "가나다", score: 888 },
      { nickname: "ㄱㄴㄷ", score: 777 },
    ],
    synonym: [
      { nickname: "유의천재", score: 920 },
      { nickname: "단어짱", score: 880 },
      { nickname: "사자성어매니아", score: 860 },
    ],
    combo: [
      { nickname: "한자달인", score: 950 },
      { nickname: "한자초보", score: 899 },
      { nickname: "초심자", score: 850 },
    ],
  };

  const [selected, setSelected] = useState("quiz");
  const ranks = sampleRankings[selected] || [];

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-[#f2f2f2] pb-12">
      <Header
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        setShowLoginModal={() => {}}
      />

      <div className="w-full max-w-2xl mx-auto px-4 pt-8">
        <h1 className="text-lg font-bold mb-6">랭킹</h1>

        <div className="flex gap-3 justify-center mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelected(cat.id)}
              className={`flex flex-col items-center justify-center w-14 h-14 rounded-full border text-sm font-medium transition-all duration-150 ${
                selected === cat.id
                  ? "bg-black text-white border-black"
                  : "bg-gray-200 text-black border-gray-300"
              }`}
            >
              <span className="text-lg">{cat.tag}</span>
              <span className="text-[10px]">{cat.label}</span>
            </button>
          ))}
        </div>

        <div className="text-center text-sm mb-2 font-bold">
          {today} 화요일
        </div>

        <div className="flex items-end justify-center gap-4 mt-4">
          {/* 2nd */}
          <div className="bg-gray-200 w-20 h-32 rounded-xl flex flex-col justify-end items-center py-2 text-sm">
            <div className="mb-1">2nd</div>
            <div className="font-bold">{ranks[1]?.nickname}</div>
            <div>{ranks[1]?.score}점</div>
          </div>

          {/* 1st */}
          <div className="bg-yellow-300 w-24 h-40 rounded-xl flex flex-col justify-end items-center py-2 text-sm">
            <div className="mb-1">1st</div>
            <div className="font-bold">{ranks[0]?.nickname}</div>
            <div>{ranks[0]?.score}점</div>
          </div>

          {/* 3rd */}
          <div className="bg-amber-500 w-20 h-28 rounded-xl flex flex-col justify-end items-center py-2 text-sm text-white">
            <div className="mb-1">3rd</div>
            <div className="font-bold">{ranks[2]?.nickname}</div>
            <div>{ranks[2]?.score}점</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RankingPage;
