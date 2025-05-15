import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Fade } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { unreadCountState } from './unreadCountAtom';

function NotificationPopup() {
  const [notifications, setNotifications] = useState([]);
  const [visible, setVisible] = useState(false);
  const token = localStorage.getItem('token');
  const userEmail = token ? jwtDecode(token).email : null;
  const navigate = useNavigate();
  const setUnreadCount = useSetRecoilState(unreadCountState);

  // 초기 알림 목록
  useEffect(() => {
    const fetchUnreadList = async () => {
      if (!userEmail) return;
      try {
        const res = await fetch(`http://localhost:3005/pro-notification/notification/recent?user=${userEmail}`);
        const data = await res.json();
        if (data.length > 0) {
          const newList = data.map(n => ({
            id: Date.now() + Math.random(),
            notiId: n.NOTI_ID,
            targetId: n.TARGET_ID,
            message: n.MESSAGE,
            type: n.NOTI_TYPE,
            senderEmail: n.SENDER_EMAIL // ✅ 보낸 사람의 이메일
          }));
          setNotifications(newList);
          setUnreadCount(data.length);
          setVisible(true);
          setTimeout(() => setVisible(false), 4000);
        }
      } catch (err) {
        console.error("초기 알림 불러오기 실패:", err);
      }
    };
    fetchUnreadList();
  }, [userEmail]);

  // 주기적 확인
  useEffect(() => {
    if (!userEmail) return;
    const checkNotification = async () => {
      try {
        const res = await fetch(`http://localhost:3005/pro-notification/notification/recent?user=${userEmail}`);
        const data = await res.json();
        if (data.length > notifications.length) {
          const newest = data[0];
          const newNoti = {
            id: Date.now(),
            notiId: newest.NOTI_ID,
            targetId: newest.TARGET_ID,
            message: newest.MESSAGE,
            type: newest.NOTI_TYPE,
            senderEmail: newest.SENDER_EMAIL
          };
          setNotifications((prev) => [...prev, newNoti]);
          setUnreadCount(data.length);
          setVisible(true);
          setTimeout(() => setVisible(false), 4000);
        }
      } catch (err) {
        console.error("알림 확인 실패:", err);
      }
    };
    const interval = setInterval(checkNotification, 10000);
    return () => clearInterval(interval);
  }, [userEmail, notifications]);

  const getColorByType = (type) => {
    switch (type) {
      case 'COMMENT': return '#ff1744';
      case 'LIKE': return '#2979ff';
      case 'FOLLOW': return '#00e676';
      default: return '#fff';
    }
  };

  return (
    <Fade in={visible}>
      <Box sx={{ position: 'fixed', bottom: 30, right: 30, zIndex: 1500 }}>
        {notifications.slice(-1).map((note) => (
          <Paper
            key={note.id}
            onClick={async () => {
              try {
                await fetch(`http://localhost:3005/pro-notification/notification/${note.notiId}/read`, {
                  method: 'PATCH'
                });
                setUnreadCount(prev => Math.max(prev - 1, 0)); // ✅ 숫자 차감

                if (note.type === 'FOLLOW') {
                  navigate(`/mypage/${encodeURIComponent(note.senderEmail)}`);
                } else {
                  navigate(`/post/${note.targetId}`);
                }
              } catch (err) {
                console.error("알림 클릭 실패:", err);
              }
            }}
            sx={{
              cursor: 'pointer',
              px: 3,
              py: 2,
              borderRadius: 2,
              backgroundColor: 'rgba(30,30,30,0.95)',
              color: getColorByType(note.type),
              boxShadow: '0 0 12px rgba(255,0,0,0.4)',
              minWidth: 280,
              maxWidth: 360,
              border: '1px solid #ff1744'
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