// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // ✅ 이 줄이 반드시 있어야 Tailwind가 적용됨
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
