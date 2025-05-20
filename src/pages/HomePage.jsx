import { useState } from "react";

const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");

  const [progress, setProgress] = useState(0);
  const [accuracy, setAccuracy] = useState(0);


  const menuItems = [
    { title: "학습하기", color: "bg-red-400" },
    { title: "낱말카드", color: "bg-orange-300" },
    { title: "단어퀴즈", color: "bg-yellow-300" },
    { title: "오답노트", color: "bg-teal-300" },
  ];

  const handleLogin = () => {
    // 실제 로그인 로직은 나중에 연결
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };  

  return (
    <div className="min-h-screen bg-[#f2f2f2] flex flex-col justify-between">
      {/* 헤더 */}
      <header className="flex justify-between items-center px-6 py-4 bg-white shadow-sm">
        <div className="text-sm">학습하기 ▼</div>
        <div
          className="text-sm cursor-pointer"
          onClick={() =>
            isLoggedIn ? setIsLoggedIn(false) : setShowLoginModal(true)
          }
        >
          {isLoggedIn ? "로그아웃" : "로그인"}
        </div>

      </header>

      {/* 카드 영역 */}
      <div className="mt-10 flex justify-center space-x-8">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`w-48 h-52 ${item.color} rounded-xl shadow-md flex flex-col items-center justify-center`}
          >
            <div className="text-lg font-bold">{item.title}</div>
            <div className="relative mt-4 w-24 h-14">
              <div className="absolute top-1 left-2 w-20 h-12 bg-white rounded-md shadow opacity-50" />
              <div className="absolute top-3 left-0 w-20 h-12 bg-white rounded-md shadow" />
            </div>
          </div>
        ))}
      </div>

      {/* 하단 반원 */}
      <div className="relative h-[180px]">
        <div className="absolute inset-x-0 bottom-0 w-full h-[180px] bg-white rounded-t-full flex flex-col items-center justify-center px-6">
          {isLoggedIn ? (
            <div className="text-center w-full max-w-md">
              <p className="text-lg font-bold mb-3">{nickname}</p>
          
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm w-14 text-right">학습률</span>
                <span className="text-sm w-8 text-left">{progress}%</span>
                <div className="flex-1 bg-gray-300 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-blue-500 h-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
          
              <div className="flex items-center gap-2">
                <span className="text-sm w-14 text-right">정확도</span>
                <span className="text-sm w-8 text-left">{accuracy}%</span>
                <div className="flex-1 bg-gray-300 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-blue-400 h-full"
                    style={{ width: `${accuracy}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <p className="text-lg text-gray-500">비회원으로 사용중입니다</p>
          )}
        </div>
      </div>

      {/* 로그인 모달 */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-80 rounded-lg shadow-lg p-6 relative">
            {/* 닫기 버튼 */}
            <button
              className="absolute top-2 right-3 text-xl"
              onClick={() => setShowLoginModal(false)}
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-4">로그인</h2>
            <input
              type="text"
              placeholder="닉네임"
              className="w-full p-2 border rounded mb-3"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <input
              type="password"
              placeholder="비밀번호"
              className="w-full p-2 border rounded mb-4"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={handleLogin}
              className="w-full bg-black text-white py-2 rounded"
            >
              로그인
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
