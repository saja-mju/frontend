// src/pages/RankingPage.jsx
import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { motion } from "framer-motion";

const RankingPage = ({ isLoggedIn, setIsLoggedIn, nickname }) => {
  const categories = [
    { id: "all", label: "전체", tag: "ALL" },
    { id: "quiz", label: "단어퀴즈", tag: "가나" },
    { id: "synonym", label: "유의어퀴즈", tag: "漢字" },
    { id: "combo", label: "한자조합", tag: "漢" },
  ];

  // 선택된 카테고리 ("all" | "quiz" | "synonym" | "combo")
  const [selected, setSelected] = useState("all");

  // 백엔드에서 받아온 랭킹 데이터 (최대 10명)
  // [{ username: "...", score: 123 }, ...]
  const [ranks, setRanks] = useState([]);

  // 로딩 상태
  const [loading, setLoading] = useState(false);

  // 에러 메시지
  const [error, setError] = useState(null);

  // 오늘 날짜 (한국어 로케일)
  const today = new Date().toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });

  // selected(카테고리)가 바뀔 때마다 백엔드 호출
  useEffect(() => {
    // 만약 로그인 여부를 반드시 체크하고 싶으면 이곳에 넣어도 됩니다.
    // if (!isLoggedIn) return;

    const fetchRanking = async () => {
      setLoading(true);
      setError(null);

      try {
        let url = "";
        let options = { method: "GET", credentials: "include" };

        if (selected === "all") {
          // 전체 랭킹
          url = "http://localhost:3000/results/ranking";
        } else if (selected === "quiz") {
          // 단어퀴즈 모드별 랭킹 -> mode=basic
          url = "http://localhost:3000/results/ranking-mode?mode=basic";
        } else if (selected === "synonym") {
          // 유의어퀴즈 모드별 랭킹 -> mode=synonym
          url = "http://localhost:3000/results/ranking-mode?mode=synonym";
        } else if (selected === "combo") {
          // 한자조합 모드별 랭킹 -> mode=hanja
          url = "http://localhost:3000/results/ranking-mode?mode=hanja";
        }

        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error(`서버 에러: ${response.status}`);
        }
        const data = await response.json();
        // data 형식: [{ username: "홍길동", score: 970 }, ...]
        setRanks(data);
      } catch (err) {
        console.error("랭킹 조회 중 오류:", err);
        setError("랭킹 데이터를 불러오는 데 실패했습니다.");
        setRanks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, [selected]);

  return (
    <div className="min-h-screen bg-white pb-16">
      <Header
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        // Header에서 로그인/로그아웃 토글시키는 용도
        setShowLoginModal={() => {}}
      />

      <div className="w-full max-w-3xl mx-auto px-4 pt-10">
        <h1 className="text-2xl font-bold text-center mb-4">🏅 오늘의 랭킹</h1>

        {/* 카테고리 탭 */}
        <div className="flex gap-3 justify-center mb-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelected(cat.id)}
              className={`
                flex flex-col items-center justify-center
                w-14 h-14 rounded-full border text-sm font-medium
                transition-all duration-150
                ${
                  selected === cat.id
                    ? "bg-black text-white border-black"
                    : "bg-gray-200 text-black border-gray-300"
                }
                shadow-sm
              `}
            >
              <span className="text-lg">{cat.tag}</span>
              <span className="text-[10px]">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* 오늘 날짜 */}
        <div className="text-center text-sm text-gray-600 mb-4">{today}</div>

        {/* 로딩/에러 처리 */}
        {loading && (
          <div className="text-center py-8 text-gray-500">랭킹 로딩 중...</div>
        )}
        {error && (
          <div className="text-center py-8 text-red-500">{error}</div>
        )}

        {!loading && !error && (
          <>
            {/* 1~3위 박스 */}
            <motion.div
              className="flex items-end justify-center gap-6 mt-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* 2nd place */}
              <div
                className={`
                  w-24 h-32 rounded-xl shadow flex flex-col justify-end items-center py-2 text-sm
                  ${ranks[1]
                    ? "bg-gray-100 text-gray-800"
                    : "bg-gray-50 text-gray-400"
                  }
                `}
              >
                <div className="mb-1 text-gray-500">🥈 2nd</div>
                <div className="font-bold">{ranks[1]?.username || "-"}</div>
                <div>{ranks[1]?.score != null ? `${ranks[1].score}점` : "-"}</div>
              </div>

              {/* 1st place */}
              <div
                className={`
                  w-28 h-40 rounded-xl shadow-xl flex flex-col justify-end items-center py-2 text-sm
                  ${ranks[0]
                    ? "bg-yellow-300 text-black"
                    : "bg-gray-50 text-gray-400"
                  }
                `}
              >
                <div className={ranks[0] ? "mb-1 text-black" : "mb-1 text-gray-500"}>
                  🥇 1st
                </div>
                <div className={`font-bold ${ranks[0] ? "text-black" : ""}`}>
                  {ranks[0]?.username || "-"}
                </div>
                <div className={ranks[0] ? "text-black" : ""}>
                  {ranks[0]?.score != null ? `${ranks[0].score}점` : "-"}
                </div>
              </div>

              {/* 3rd place */}
              <div
                className={`
                  w-24 h-28 rounded-xl shadow flex flex-col justify-end items-center py-2 text-sm
                  ${ranks[2]
                    ? "bg-amber-500 text-white"
                    : "bg-gray-50 text-gray-400"
                  }
                `}
              >
                <div className={ranks[2] ? "mb-1" : "mb-1 text-gray-500"}>🥉 3rd</div>
                <div className="font-bold">{ranks[2]?.username || "-"}</div>
                <div>{ranks[2]?.score != null ? `${ranks[2].score}점` : "-"}</div>
              </div>
            </motion.div>

            {/* 4~10위 리스트 */}
            <div className="mt-10 max-w-md mx-auto">
              <h2 className="text-center font-semibold mb-3 text-gray-700">
                다른 랭커
              </h2>
              <ul className="space-y-2">
                {/*
                  slice(3, 10) => 4위부터 10위 (0-based index이므로 3부터 시작)
                */}
                {ranks.slice(3, 10).map((user, i) => (
                  <li
                    key={i}
                    className="flex justify-between items-center px-4 py-2 rounded-md bg-gray-50 shadow text-sm"
                  >
                    <span className="text-gray-500">{i + 4}위</span>
                    <span className="font-medium">{user.username}</span>
                    <span>{user.score}점</span>
                  </li>
                ))}

                {/*
                  만약 10명 미만이라면 빈 슬롯을 채워서 “-” 등을 출력하고 싶다면 
                  ranks.length를 체크해서 조건부로 렌더링을 추가하시면 됩니다.
                */}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RankingPage;


