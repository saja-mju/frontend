// src/components/DailyResultModal.jsx
import React from "react";
import CalendarModal from "./CalendarModal";

const DailyResultModal = ({ onClose, quizData, userAnswer, correct }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[90%] max-w-xl p-6 shadow-lg relative">
        <button className="absolute top-3 right-4 text-xl" onClick={onClose}>
          ✖
        </button>

        <h2 className="text-xl font-bold mb-4">오늘의 문제 결과</h2>

        <div className="mb-6">
          <p className="font-semibold mb-2">문제:</p>
          <div className="bg-gray-100 rounded p-3">{quizData?.description}</div>

          <p className="font-semibold mt-4">정답:</p>
          <div className="text-green-600">{quizData?.answer}</div>

          <p className="font-semibold mt-4">내가 고른 답:</p>
          <div className={userAnswer === quizData?.answer ? "text-green-600" : "text-red-500"}>
            {userAnswer || "선택 없음"}
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-2">달력</h3>
        <CalendarModal />
      </div>
    </div>
  );
};

export default DailyResultModal;
