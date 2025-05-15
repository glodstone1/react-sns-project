import React, { useEffect, useState } from 'react';
import { Box, List, ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Badge } from '@mui/material';
import socket from '../socket'; // ✅ socket 불러오기

function DMList({ myEmail, onSelectUser, refreshKey }) {
  const [dmList, setDmList] = useState([]);

  // ✅ DM 목록 불러오기 함수
  const loadList = async () => {
    if (!myEmail) return;

    const res = await fetch(`http://localhost:3005/pro-chat/list/${myEmail}`);
    const json = await res.json();
    if (json.result === 'success') {
      setDmList(json.data);
    }
  };

  // ✅ 최초 로딩 및 refreshKey 변경 시 fetch
  useEffect(() => {
    loadList();
  }, [myEmail, refreshKey]);

  // ✅ 소켓 수신 시에도 목록 새로고침
  useEffect(() => {
    const handleReceive = (message) => {
      // 내가 받았거나, 내가 보낸 메시지면 목록 갱신
      if (
        message.SENDER_EMAIL === myEmail ||
        message.RECEIVER_EMAIL === myEmail
      ) {
        loadList();
      }
    };

    socket.on('receive_dm', handleReceive);

    return () => {
      socket.off('receive_dm', handleReceive); // 중복 방지
    };
  }, [myEmail]);

  return (
    <Box width="30%" borderRight="1px solid #444" overflow="auto">
      <List>
        {dmList.length === 0 ? (
          <Typography sx={{ color: 'gray', p: 2 }}>
            대화 상대가 없습니다.
          </Typography>
        ) : (
          dmList.map((dm) => (
            <ListItem button key={dm.other_user} onClick={() => onSelectUser(dm.other_user)}>
              <ListItemAvatar>
                <Badge badgeContent={dm.unread_count} color="error">
                  <Avatar src="/default-profile.png" />
                </Badge>
              </ListItemAvatar>
              <ListItemText
                primary={dm.other_user}
                secondary={dm.last_msg}
              />
            </ListItem>
          ))
        )}
      </List>
    </Box>
  );
}

export default DMList;