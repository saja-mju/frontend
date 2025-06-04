// src/components/CalendarModal.jsx
import React, { useState, useEffect } from "react";

/**
 * quizHistory: ["2025-06-01", "2025-05-30", ...]
 * 
 * 이 예시에서는 해당 날짜에 문제를 풀었으면 ✅, 아니면 그냥 기본 스타일로 표시합니다.
 */
const CalendarModal = ({ quizHistory = [] }) => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth()); // 0~11

  // 달 시작 요일과 마지막 날 계산
  const firstDayOfMonth = new Date(year, month, 1).getDay();    // 0=일요일, 6=토요일
  const daysInMonth = new Date(year, month + 1, 0).getDate();   // 해당 월의 마지막 일자 (28~31)

  // 달력에 그릴 날짜 배열 (1일부터 최대 daysInMonth까지)
  const calendarDays = [];
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  // “YYYY-MM-DD” 형식으로 변환하는 헬퍼
  const formatDate = (y, m, d) => {
    const mm = String(m + 1).padStart(2, "0");
    const dd = String(d).padStart(2, "0");
    return `${y}-${mm}-${dd}`;
  };

  // 달력 앞부분에 빈 공간 채우기
  const blankSlots = Array(firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1).fill(null);

  return (
    <div>
      {/* 달과 연도 선택 (이 컴포넌트에서는 고정된 달만 쓰지만 다음/이전 버튼 넣어서 바꿀 수 있습니다.) */}
      <div className="flex justify-center mb-3 space-x-4">
        <button
          onClick={() => {
            if (month === 0) {
              setYear(year - 1);
              setMonth(11);
            } else {
              setMonth(month - 1);
            }
          }}
          className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded"
        >
          〈
        </button>
        <span className="text-lg font-semibold">
          {year}년 {month + 1}월
        </span>
        <button
          onClick={() => {
            if (month === 11) {
              setYear(year + 1);
              setMonth(0);
            } else {
              setMonth(month + 1);
            }
          }}
          className="px-2 py-1 text-gray-600 hover:bg-gray-100 rounded"
        >
          〉
        </button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-1 text-center font-medium text-sm text-gray-700 mb-1">
        {["월", "화", "수", "목", "금", "토", "일"].map((wd) => (
          <div key={wd}>{wd}</div>
        ))}
      </div>

      {/* 날짜 그리기 */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {/* 빈 슬롯 먼저 채우기 */}
        {blankSlots.map((_, idx) => (
          <div key={"b" + idx} className="h-10"></div>
        ))}

        {/* 실제 날짜들 */}
        {calendarDays.map((day) => {
          const fullDate = formatDate(year, month, day);
          const isPlayed = quizHistory.includes(fullDate);

          return (
            <div
              key={day}
              className={`
                h-10 flex items-center justify-center rounded-md 
                ${isPlayed ? "bg-green-200 text-green-800 font-semibold" : ""}
              `}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarModal;
