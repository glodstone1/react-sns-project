import React, { useState, useRef, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import {
  Box, CssBaseline, GlobalStyles, IconButton, ThemeProvider, createTheme
} from '@mui/material';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import MusicOffIcon from '@mui/icons-material/MusicOff';
import ProLogin from './components/ProLogin';
import Join from './components/Join';
import Feed from './components/Feed';
import Register from './components/Register';
import MyPage from './components/MyPage';
import Menu from './components/Menu';
import Header from './components/Header'; // ✅ 헤더 추가
import FeedDetail from './components/FeedDetail';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: { default: '#000' },
    text: { primary: '#ccc' },
  },
});

function App() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === '/prologin' ||
    location.pathname === '/join' ||
    location.pathname === '/';

  const [isPlaying, setIsPlaying] = useState(true);
  const audioRef = useRef(null);

  useEffect(() => {
    const handleFirstClick = () => {
      const audio = audioRef.current;
      if (audio && audio.muted) {
        audio.muted = false;
        audio.volume = 0;
        audio.play();
        const interval = setInterval(() => {
          if (audio.volume < 1) {
            audio.volume = Math.min(audio.volume + 0.05, 1);
          } else {
            clearInterval(interval);
          }
        }, 200);
      }
    };
    document.addEventListener('click', handleFirstClick, { once: true });
    return () => document.removeEventListener('click', handleFirstClick);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) audio.play();
      else audio.pause();
    }
  }, [isPlaying]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <GlobalStyles styles={{
        body: {
          margin: 0,
          backgroundColor: '#000',
          backgroundImage: "url('https://img.freepik.com/premium-photo/ethereal-obscurity-captivating-depths-photo-black-glitch-effect-texture_1000124-43856.jpg?w=996')",
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center',
          color: '#ccc',
          fontFamily: 'Cinzel, serif',
        }
      }} />

      {/* 🔊 배경 음악 */}
      {/* <audio
        ref={audioRef}
        src="/audio/bg.mp3"
        loop
        autoPlay
        muted
        hidden
      /> */}

      {/* 🔊 음악 토글 버튼 */}
      {/* <IconButton
        onClick={() => setIsPlaying(!isPlaying)}
        sx={{
          position: 'fixed',
          top: 10,
          left: 10,
          color: '#fff',
          zIndex: 9999,
          backgroundColor: 'rgba(0,0,0,0.5)',
          '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
        }}
      >
        {isPlaying ? <MusicNoteIcon /> : <MusicOffIcon />}
      </IconButton> */}

      {/* 전체 레이아웃 */}
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {!isAuthPage && <Header />}
         {/* ✅ 헤더 표시 조건 */}
        <Box sx={{ display: 'flex' }}>
          {!isAuthPage && <Menu />}
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Routes>
              <Route path="/" element={<ProLogin />} />
              <Route path="/prologin" element={<ProLogin />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/join" element={<Join />} />
              <Route path="/register" element={<Register />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/post/:id" element={<FeedDetail />} />
              <Route path="/edit" element={<Register editMode={true} postData={location.state} />} />
              {/* 👉 추후 프로필 등 경로 추가 가능 */}
            </Routes>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;