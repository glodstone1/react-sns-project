import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Box, CssBaseline } from '@mui/material';
import ProLogin from './components/ProLogin';
import Join from './components/Join'; // Join으로 변경
import Feed from './components/Feed';
import Register from './components/Register';
import MyPage from './components/MyPage';
import Menu from './components/Menu'; // Menu로 변경

function App() {
  const location = useLocation();
  const isAuthPage = location.pathname === '/prologin' || location.pathname === '/join' || location.pathname === '/';

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {!isAuthPage && <Menu />} {/* 로그인과 회원가입 페이지가 아닐 때만 Menu 렌더링 */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Routes>
          <Route path="/" element={<ProLogin />} />
          <Route path="/prologin" element={<ProLogin />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/join" element={<Join />} />
          <Route path="/register" element={<Register />} />
          <Route path="/mypage" element={<MyPage />} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
