import { useState } from "react";
import Header from "../components/Header";
import { motion } from "framer-motion";

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
      { nickname: "이몽룡", score: 860 },
      { nickname: "성춘향", score: 850 },
      { nickname: "박서방", score: 840 },
      { nickname: "고길동", score: 830 },
      { nickname: "둘리", score: 820 },
      { nickname: "마이콜", score: 810 },
      { nickname: "도우너", score: 800 },
    ],
    quiz: [],
    synonym: [],
    combo: [],
  };

  const [selected, setSelected] = useState("all");
  const ranks = sampleRankings[selected] || [];

  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  return (
    <div className="min-h-screen bg-white pb-16">
      <Header
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        setShowLoginModal={() => {}}
      />

      <div className="w-full max-w-3xl mx-auto px-4 pt-10">
        <h1 className="text-2xl font-bold text-center mb-4">🏅 오늘의 랭킹</h1>

        <div className="flex gap-3 justify-center mb-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelected(cat.id)}
              className={`flex flex-col items-center justify-center w-14 h-14 rounded-full border text-sm font-medium transition-all duration-150 ${
                selected === cat.id
                  ? "bg-black text-white border-black"
                  : "bg-gray-200 text-black border-gray-300"
              } shadow-sm`}
            >
              <span className="text-lg">{cat.tag}</span>
              <span className="text-[10px]">{cat.label}</span>
            </button>
          ))}
        </div>

        <div className="text-center text-sm text-gray-600 mb-4">{today}</div>

        <motion.div
          className="flex items-end justify-center gap-6 mt-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gray-100 w-24 h-32 rounded-xl shadow flex flex-col justify-end items-center py-2 text-sm">
            <div className="mb-1 text-gray-500">🥈 2nd</div>
            <div className="font-bold">{ranks[1]?.nickname}</div>
            <div>{ranks[1]?.score}점</div>
          </div>

          <div className="bg-yellow-300 w-28 h-40 rounded-xl shadow-xl flex flex-col justify-end items-center py-2 text-sm">
            <div className="mb-1 text-black">🥇 1st</div>
            <div className="font-bold text-black">{ranks[0]?.nickname}</div>
            <div className="text-black">{ranks[0]?.score}점</div>
          </div>

          <div className="bg-amber-500 w-24 h-28 rounded-xl shadow flex flex-col justify-end items-center py-2 text-sm text-white">
            <div className="mb-1">🥉 3rd</div>
            <div className="font-bold">{ranks[2]?.nickname}</div>
            <div>{ranks[2]?.score}점</div>
          </div>
        </motion.div>

        <div className="mt-10 max-w-md mx-auto">
          <h2 className="text-center font-semibold mb-3 text-gray-700">다른 랭커</h2>
          <ul className="space-y-2">
            {ranks.slice(3, 10).map((user, i) => (
              <li
                key={i}
                className="flex justify-between items-center px-4 py-2 rounded-md bg-gray-50 shadow text-sm"
              >
                <span className="text-gray-500">{i + 4}위</span>
                <span className="font-medium">{user.nickname}</span>
                <span>{user.score}점</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RankingPage;
