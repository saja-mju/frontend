import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import SignUpModal from "../components/SignUpModal";

const HomePage = ({
  isLoggedIn,
  setIsLoggedIn,
  showLoginModal,
  setShowLoginModal,
  nickname,
  setNickname,
  progress,
  setProgress,
  accuracy,
  setAccuracy,
  setShowDailyResultModal,
}) => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  const guestItems = [
    { title: "학습하기", color: "bg-red-400", link: "/learn" },
    { title: "낱말카드", color: "bg-orange-300", link: "/cards" },
    { title: "단어퀴즈", color: "bg-yellow-300", link: "/quiz" },
  ];

  const loggedInItems = [
    ...guestItems,
    { title: "유의어퀴즈", color: "bg-lime-300", link: "/quiz/synonym" },
    { title: "한자조합", color: "bg-green-300", link: "/quiz/combo" },
    { title: "오답노트", color: "bg-teal-300", link: "/wrong" },
    { title: "오늘의 문제", color: "bg-blue-300", link: "/daily" },
    { title: "랭킹", color: "bg-purple-300", link: "/ranking" },
  ];

  const menuItems = isLoggedIn ? loggedInItems : guestItems;

  const handleLogin = async () => {
    if (nickname.trim() === "" || password.trim() === "") {
      alert("닉네임과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          username: nickname,
          password: password,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setIsLoggedIn(true);
        setShowLoginModal(false);
        alert("로그인 성공!");
      } else {
        alert(data.message || "로그인 실패");
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      alert("서버 오류");
    }
  };

  const handleCardClick = (item) => {
    if (item.link === "/daily") {
      setShowDailyResultModal(true);
    } else {
      navigate(item.link);
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f2f2] flex flex-col justify-between relative overflow-x-hidden">
      <Header
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        setShowLoginModal={setShowLoginModal}
        setShowDailyResultModal={setShowDailyResultModal}
      />

      <div className="mt-10 w-full px-4 flex justify-center">
        <div className={`grid ${isLoggedIn ? "grid-cols-4" : "grid-cols-3"} gap-4`}>
          {menuItems.map((item, index) => (
            <div
              key={index}
              onClick={() => handleCardClick(item)}
              className={`w-48 h-52 ${item.color} rounded-xl shadow-md flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform`}
            >
              <div className="text-lg font-bold">{item.title}</div>
              <div className="relative mt-4 w-24 h-14">
                <div className="absolute top-1 left-2 w-20 h-10 bg-white rounded-md shadow opacity-50" />
                <div className="absolute top-3 left-0 w-20 h-10 bg-white rounded-md shadow" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative h-[180px] mt-10">
        <div className="absolute inset-x-0 bottom-0 w-full h-[180px] bg-white rounded-t-full flex flex-col items-center justify-center">
          {!isLoggedIn ? (
            <p className="text-lg text-gray-500">비회원으로 사용중입니다</p>
          ) : (
            <div className="text-center w-full max-w-md px-4">
              <p className="text-lg font-bold mb-2">{nickname}</p>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm w-14 text-right">학습률</span>
                <span className="text-sm w-8 text-left">{progress}%</span>
                <div className="flex-1 bg-gray-300 rounded-full h-3 overflow-hidden">
                  <div className="bg-blue-500 h-full" style={{ width: `${progress}%` }} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm w-14 text-right">정확도</span>
                <span className="text-sm w-8 text-left">{accuracy}%</span>
                <div className="flex-1 bg-gray-300 rounded-full h-3 overflow-hidden">
                  <div className="bg-blue-400 h-full" style={{ width: `${accuracy}%` }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-80 rounded-lg shadow-lg p-6 relative z-50">
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
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              로그인
            </button>
            <button
              onClick={() => {
                setShowLoginModal(false);
                setShowSignUpModal(true);
              }}
              className="mt-2 w-full text-sm text-blue-500 hover:underline"
            >
              아직 계정이 없으신가요? 회원가입
            </button>
          </div>
        </div>
      )}

      {showSignUpModal && (
        <SignUpModal
          setShowSignUpModal={setShowSignUpModal}
          setShowLoginModal={setShowLoginModal}
        />
      )}
    </div>
  );
};

export default HomePage;
