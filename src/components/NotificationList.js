import React, { useEffect, useState } from 'react';
import {
  List, ListItem, ListItemAvatar, ListItemText,
  Avatar, Box, Typography, Paper
} from '@mui/material';

import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import CommentIcon from '@mui/icons-material/Comment';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { useNavigate } from 'react-router-dom';
dayjs.extend(relativeTime);

function NotificationList() {
  const [notifications, setNotifications] = useState([]);
  const token = localStorage.getItem('token');
  const userEmail = token ? jwtDecode(token).email : null;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      const res = await fetch(`http://localhost:3005/pro-notification/all?user=${userEmail}`);
      const data = await res.json();

      const formatted = data.map(n => ({
        id: n.NOTI_ID,
        type: n.NOTI_TYPE,
        message: n.MESSAGE,
        targetId: n.TARGET_ID,
        senderEmail: n.SENDER_EMAIL,
        nickname: n.NICK_NAME,
        profileImg: n.PROFILE_IMG,
        time: dayjs(n.CDATE_TIME).fromNow()
      }));

      setNotifications(formatted);
    };
    fetchNotifications();
  }, [userEmail]);

  const getIconByType = (type) => {
    switch (type) {
      case 'COMMENT':
        return <CommentIcon sx={{ color: '#444' }} />;
      case 'LIKE':
        return <FavoriteBorderIcon sx={{ color: '#ff1744' }} />;
      case 'FOLLOW':
        return <VisibilityIcon sx={{ color: '#00e676' }} />;
      default:
        return null;
    }
  };

  const getColorByType = (type) => {
    switch (type) {
      case 'COMMENT': return '#ff1744';
      case 'LIKE': return '#2979ff';
      case 'FOLLOW': return '#00e676';
      default: return '#ccc';
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        maxWidth: 500,
        margin: '0 auto',
        p: 4,
        color: "#ddd",
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: 3,
        boxShadow: '0 0 20px rgba(255, 0, 0, 0.2)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <Box>
        <Typography
          variant="h5"
          align="center"
          sx={{
            mb: 3,
            fontFamily: 'Creepster, cursive',
            color: '#ff1744',
            letterSpacing: 2,
            textShadow: '1px 1px 4px rgba(0,0,0,0.8)',
            animation: 'flicker 2.5s infinite alternate',
          }}
        >
          🔔 WHISPERS
        </Typography>

        <style>
          {`
    @keyframes flicker {
      0% { opacity: 1; }
      50% { opacity: 0.85; }
      80% { opacity: 0.6; transform: scale(1.01); }
      100% { opacity: 1; }
    }
  `}
        </style>

        <List>
          {notifications.map((noti) => (
            <ListItem
              key={noti.id}
              onClick={() => {
                // ✅ 알림 읽음 처리
                fetch(`http://localhost:3005/pro-notification/notification/${noti.id}/read`, {
                  method: 'PATCH'
                });

                // ✅ 클릭 타입에 따라 이동 경로 분기
                if (noti.type === 'FOLLOW') {
                  navigate(`/mypage/${noti.senderEmail}`);
                } else if (noti.type === 'COMMENT' || noti.type === 'LIKE') {
                  navigate(`/post/${noti.targetId}`);
                }
              }}
              sx={{
                borderBottom: '1px solid #333',
                py: 2,
                px: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  cursor: 'pointer'
                }
              }}
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor: 'rgba(0,0,0,0.6)',
                    border: `2px solid ${getColorByType(noti.type)}`
                  }}
                  onClick={(e) => {
                    e.stopPropagation(); // ✅ 클릭 이벤트 버블링 방지
                    navigate(`/mypage/${noti.senderEmail}`);
                  }}
                >
                  {getIconByType(noti.type)}
                </Avatar>
              </ListItemAvatar>
              <ListItemAvatar>
                <Avatar
                  src={noti.profileImg ? `http://localhost:3005/${noti.profileImg}` : '/default-avatar.png'}
                  sx={{
                    bgcolor: 'rgba(110, 102, 102, 0.6)',
                  }}
                  onClick={(e) => {
                    e.stopPropagation(); // ✅ 클릭 이벤트 버블링 방지
                    navigate(`/mypage/${noti.senderEmail}`);
                  }}
                >
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography>
                    <strong
                      onClick={(e) => {
                        e.stopPropagation(); // ✅ 클릭 이벤트 버블링 방지
                        navigate(`/mypage/${noti.senderEmail}`);
                      }}
                      style={{ color: getColorByType(noti.type), cursor: 'pointer' }}
                    >
                      {noti.nickname}
                    </strong>{" "}
                    {noti.message}
                  </Typography>
                }
                secondary={noti.time}
              />
            </ListItem>
          ))}
          {notifications.length === 0 && (
            <Typography sx={{ textAlign: 'center', color: '#aaa', mt: 4 }}>
              새로운 알림이 없습니다.
            </Typography>
          )}
        </List>
      </Box>
    </Paper>
  );
}

export default NotificationList;