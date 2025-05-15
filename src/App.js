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
import Header from './components/Header';
import FeedDetail from './components/FeedDetail';
import FollowerList from './components/FollowerList';
import MyFollowingList from './components/MyFollowingList';
import MyFollowersList from './components/MyFollowersList';
import NotificationList from './components/NotificationList';
import NotificationPopup from './components/NotificationPopup'; // ✅ 알림 팝업 컴포넌트
import DMChat from './components/DMChat';
import DMList from './components/DMList';
import DMPage from './components/DMPage';
import { RecoilRoot } from 'recoil';

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
    <RecoilRoot>
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
        {/* <audio ref={audioRef} src="/audio/bg.mp3" loop autoPlay muted hidden /> */}
        {/* <IconButton ...>{isPlaying ? <MusicNoteIcon /> : <MusicOffIcon />}</IconButton> */}

        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
          {/* 👉 좌측 메뉴 */}
          {!isAuthPage && (
            <Box sx={{ width: '240px', flexShrink: 0 }}>
              <Menu />
            </Box>
          )}

          {/* 👉 우측 콘텐츠 (Header + Main) */}
          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            {!isAuthPage && <Header />}
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
                <Route path="/mypage/:email" element={<MyPage />} />
                <Route path="/followerlist" element={<FollowerList />} />
                <Route path="/myfollowinglist" element={<MyFollowingList />} />
                <Route path="/myfollowinglist/:email" element={<MyFollowingList />} />
                <Route path="/myfollowerslist" element={<MyFollowersList />} />
                <Route path="/myfollowerslist/:email" element={<MyFollowersList />} />
                <Route path="/notificationlist" element={<NotificationList />} />
                <Route path="/dmchat" element={<DMChat />} />
                <Route path="/dmlist" element={<DMList />} />
                <Route path="/dmpage" element={<DMPage />} />
              </Routes>
            </Box>
          </Box>
        </Box>
        <NotificationPopup />
      </ThemeProvider>
    </RecoilRoot>
  );
}

export default App;