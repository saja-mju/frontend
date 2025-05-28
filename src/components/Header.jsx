import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Header = ({ isLoggedIn, setIsLoggedIn, setShowLoginModal, setShowDailyResultModal }) => {
  const navigate = useNavigate();
  const [hoverMenu, setHoverMenu] = useState(null);
  const timeoutRef = useRef(null);

  const fullMenuItems = [
    {
      label: "기본학습",
      subItems: [
        { label: "학습하기", path: "/learn" },
        { label: "낱말카드", path: "/cards" },
      ],
    },
    {
      label: "문제풀이",
      subItems: [
        { label: "단어퀴즈", path: "/quiz" },
        { label: "유의어퀴즈", path: "/quiz/synonym" },
        { label: "한자조합", path: "/quiz/combo" },
      ],
    },
    {
      label: "오답노트",
      path: "/wrong",
      subItems: null,
    },
    {
      label: "랭킹",
      path: "/ranking",
      subItems: null,
    },
  ];

  const guestMenuItems = [
    {
      label: "기본학습",
      subItems: [
        { label: "학습하기", path: "/learn" },
      ],
    },
  ];

  const menuItems = isLoggedIn ? fullMenuItems : guestMenuItems;

  const handleMouseEnter = (index) => {
    clearTimeout(timeoutRef.current);
    setHoverMenu(index);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoverMenu(null);
    }, 150);
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-white shadow-sm relative z-50">
      <nav className="flex gap-6 text-sm relative items-center">
        {/* 홈버튼 */}
        <div
          className="cursor-pointer font-semibold"
          onClick={() => navigate("/")}
        >
          홈
        </div>

        {menuItems.map((menu, index) => (
          <div
            key={index}
            className="relative"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <div
              className={`cursor-pointer px-1 py-0.5 ${
                hoverMenu === index ? "bg-yellow-200" : ""
              }`}
              onClick={() => {
                if (!menu.subItems) {
                  if (menu.label === "오늘의 문제") {
                    setShowDailyResultModal(true);
                  } else if (menu.path) {
                    navigate(menu.path);
                  }
                }
              }}
            >
              {menu.label}
            </div>

            {hoverMenu === index && Array.isArray(menu.subItems) && menu.subItems.length > 0 && (
              <div className="absolute top-full left-0 mt-2 bg-white border rounded shadow-md w-max z-50">
                {menu.subItems.map((subItem, subIndex) => (
                  <div
                    key={subIndex}
                    onClick={() => {
                      navigate(subItem.path);
                      setHoverMenu(null);
                    }}
                    className="px-4 py-2 text-sm text-gray-800 hover:font-bold hover:bg-gray-100 cursor-pointer"
                  >
                    {subItem.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

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
    </header>
  );
};

export default Header;
