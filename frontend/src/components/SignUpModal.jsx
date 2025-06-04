// src/components/SignUpModal.jsx
import React, { useState } from "react";

const SignUpModal = ({ setShowSignUpModal, setShowLoginModal }) => {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    if (nickname.trim() === "" || password.trim() === "") {
      alert("닉네임과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 세션 쿠키 포함
        body: JSON.stringify({
          username: nickname,
          password: password,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("회원가입 성공! 이제 로그인해주세요.");
        setShowSignUpModal(false);
        setShowLoginModal(true);
      } else {
        alert(data.message || "회원가입 실패");
      }
    } catch (error) {
      console.error("회원가입 오류:", error);
      alert("서버 오류");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-80 rounded-lg shadow-lg p-6 relative z-50">
        <button
          className="absolute top-2 right-3 text-xl"
          onClick={() => setShowSignUpModal(false)}
        >
          ✖
        </button>
        <h2 className="text-xl font-bold mb-4">회원가입</h2>
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
          onClick={handleSignUp}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          회원가입
        </button>
      </div>
    </div>
  );
};

export default SignUpModal;
