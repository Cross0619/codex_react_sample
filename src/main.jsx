import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// ルート要素に対してReactアプリをマウントする
ReactDOM.createRoot(document.getElementById('root')).render(
  // StrictModeは開発時に潜在的な問題を検出しやすくする
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
