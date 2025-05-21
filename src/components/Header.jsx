// src/components/Header.jsx
import { useLocation, useNavigate } from "react-router-dom";

const Header = ({ isLoggedIn, setIsLoggedIn, setShowLoginModal }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white shadow-sm">
      <div className="text-sm">
        {isHome ? "학습하기 ▼" : "학습하기"}
      </div>

      {/* 오른쪽 메뉴: 홈 버튼 + 로그인 */}
      <div className="flex items-center gap-4">
        <div
          className="text-sm cursor-pointer"
          onClick={() => navigate("/")}
        >
          홈
        </div>
        <div
          className="text-sm cursor-pointer"
          onClick={() => {
            if (isLoggedIn) {
              setIsLoggedIn(false);
            } else {
              setShowLoginModal(true);
            }
          }}
        >
          {isLoggedIn ? "로그아웃" : "로그인"}
        </div>
      </div>
    </header>
  );
};

export default Header;
