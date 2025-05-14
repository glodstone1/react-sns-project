import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Fade } from '@mui/material';
import { jwtDecode } from 'jwt-decode';

function NotificationPopup() {
  const [notifications, setNotifications] = useState([]);
  const [visible, setVisible] = useState(false);
  const token = localStorage.getItem('token');
  const userEmail = token ? jwtDecode(token).email : null;

  useEffect(() => {
    if (!userEmail) return;

    const checkNotification = async () => {
      try {
        const res = await fetch(`http://localhost:3005/pro-notification/notification/recent?user=${userEmail}`);
        const data = await res.json();

        if (data.length > 0) {
          const msg = `👻 ${data[0].NICK_NAME}님이 당신의 게시물에 댓글을 남겼습니다.`;
          setNotifications((prev) => [...prev, { id: Date.now(), message: msg }]);
          setVisible(true);

          // 자동 닫힘
          setTimeout(() => setVisible(false), 4000);
        }
      } catch (err) {
        console.error("알림 확인 실패:", err);
      }
    };

    const interval = setInterval(checkNotification, 10000); // 10초마다 체크
    return () => clearInterval(interval);
  }, [userEmail]);

  return (
    <Fade in={visible}>
      <Box
        sx={{
          position: 'fixed',
          bottom: 30,
          right: 30,
          zIndex: 1500,
        }}
      >
        {notifications.slice(-1).map((note) => (
          <Paper
            key={note.id}
            sx={{
              px: 3,
              py: 2,
              borderRadius: 2,
              backgroundColor: 'rgba(30,30,30,0.95)',
              color: '#fff',
              boxShadow: '0 0 12px rgba(255,0,0,0.4)',
              minWidth: 280,
              maxWidth: 360,
              border: '1px solid #ff1744',
            }}
          >
            <Typography variant="body1" sx={{ fontSize: 14 }}>
              {note.message}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Fade>
  );
}

export default NotificationPopup;