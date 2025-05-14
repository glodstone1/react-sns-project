import React, { useEffect, useState } from 'react';
import {
  List, ListItem, ListItemAvatar, ListItemText,
  Avatar, Box, Typography, Paper
} from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';

function NotificationList() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'follow',
      sender: 'testone7@example.com',
      nickname: 'TestOne7',
      profileImg: '', // 경로 비워두면 기본
      message: '님이 당신을 동행 요청했습니다.',
      time: '5분 전'
    },
    {
      id: 2,
      type: 'comment',
      sender: 'ghost99@example.com',
      nickname: 'Ghost99',
      profileImg: '',
      message: '님이 당신의 기록에 댓글을 남겼습니다.',
      time: '1시간 전'
    }
  ]);

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
        <Typography variant="h5" sx={{ mb: 2, fontFamily: 'Creepster, cursive', color: '#ff1744' }}>
          🔔 알림
        </Typography>

        <List>
          {notifications.map((noti) => (
            <ListItem
              key={noti.id}
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
                <Avatar src={noti.profileImg || '/default-avatar.png'}>
                  <NotificationsActiveIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography>
                    <strong style={{ color: '#ff1744' }}>{noti.nickname}</strong>
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