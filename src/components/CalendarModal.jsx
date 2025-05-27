import { useState } from "react";

const CalendarModal = ({ onClose, quizHistory }) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();

  const getDayKey = (d) => {
    const m = String(month + 1).padStart(2, "0");
    const day = String(d).padStart(2, "0");
    return `${year}-${m}-${day}`;
  };

  const calendar = [];
  for (let i = 0; i < startDay; i++) calendar.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendar.push(d);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-[90%] max-w-md p-6 shadow relative">
        <button className="absolute top-4 right-4 text-xl" onClick={onClose}>✕</button>
        <h2 className="text-xl font-bold text-center mb-4">오늘의 퀴즈</h2>

        <div className="grid grid-cols-7 gap-2 text-center text-sm mb-4 font-semibold">
          {["월", "화", "수", "목", "금", "토", "일"].map((d, i) => (
            <div key={i}>{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2 text-center text-sm">
          {calendar.map((day, i) => {
            const key = day ? getDayKey(day) : null;
            const status = quizHistory[key];
            return (
              <div key={i} className="h-8 flex items-center justify-center">
                {day && (
                  <span className="relative">
                    {day}
                    {status === "correct" && (
                      <span className="absolute -right-3 text-green-500">✓</span>
                    )}
                    {status === "wrong" && (
                      <span className="absolute -right-3 text-red-500">✗</span>
                    )}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-4 text-center text-sm">
          축하합니다! 오늘의 문제를 푸셨습니다
        </p>
      </div>
    </div>
  );
};

export default CalendarModal;