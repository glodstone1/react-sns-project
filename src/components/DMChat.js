import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, TextField, IconButton, List, ListItem, Paper } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import socket from '../socket'; // ✅ 소켓 import

function DMChat({ myEmail, targetEmail, reloadKey }) {
  const [chatList, setChatList] = useState([]);
  const [msg, setMsg] = useState('');
  const chatEndRef = useRef(null);

  // ✅ 스크롤 하단으로 이동
  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // ✅ 메시지 불러오기 + 읽음 처리
  useEffect(() => {
    if (!myEmail || !targetEmail) return;

    const loadChat = async () => {
      const res = await fetch(`http://localhost:3005/pro-chat/chat?me=${myEmail}&you=${targetEmail}`);
      const json = await res.json();
      if (json.result === 'success') {
        setChatList(json.data);
        scrollToBottom();
      }
    };

    loadChat();

    fetch(`http://localhost:3005/pro-chat/read`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ me: myEmail, you: targetEmail })
    });
  }, [myEmail, targetEmail, reloadKey]);

  // ✅ 실시간 메시지 수신 처리
  useEffect(() => {
    const handleReceive = (message) => {
      // 해당 상대방에게 온 메시지만 추가
      if (
        message.SENDER_EMAIL === targetEmail &&
        message.RECEIVER_EMAIL === myEmail
      ) {
        setChatList(prev => [...prev, message]);
        scrollToBottom();
      }
    };

    socket.on('receive_dm', handleReceive);

    return () => {
      socket.off('receive_dm', handleReceive); // 중복 제거
    };
  }, [myEmail, targetEmail]);

  // ✅ 메시지 전송
  const handleSend = async () => {
    if (!msg.trim()) return;

    const newMessage = {
      sender: myEmail,
      receiver: targetEmail,
      content: msg
    };

    // DB 저장
    await fetch(`http://localhost:3005/pro-chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMessage)
    });

    const messageToSend = {
      SENDER_EMAIL: myEmail,
      RECEIVER_EMAIL: targetEmail,
      CONTENT: msg,
      CDATE_TIME: new Date().toISOString()
    };

    // ✅ 소켓으로 실시간 전송
    socket.emit('send_dm', {
      to: targetEmail,
      message: messageToSend
    });

    // 로컬 상태 반영
    setChatList(prev => [...prev, messageToSend]);
    setMsg('');
    scrollToBottom();
  };

  if (!targetEmail) {
    return (
      <Box width="70%" display="flex" justifyContent="center" alignItems="center">
        <Typography color="gray">대화 상대를 선택하세요</Typography>
      </Box>
    );
  }

  return (
    <Box width="70%" p={2} display="flex" flexDirection="column" justifyContent="space-between">
      <Typography variant="h6" gutterBottom>{targetEmail} 님과의 대화</Typography>

      <List sx={{ flexGrow: 1, overflowY: 'auto', mb: 2 }}>
        {chatList.map((msg, idx) => (
          <ListItem key={idx} sx={{ justifyContent: msg.SENDER_EMAIL === myEmail ? 'flex-end' : 'flex-start' }}>
            <Paper sx={{ p: 1.5, bgcolor: msg.SENDER_EMAIL === myEmail ? '#333' : '#222', color: '#fff' }}>
              <Typography>{msg.CONTENT}</Typography>
              <Typography variant="caption" display="block">
                {new Date(msg.CDATE_TIME).toLocaleTimeString()}
              </Typography>
            </Paper>
          </ListItem>
        ))}
        <div ref={chatEndRef} />
      </List>

      <Box display="flex">
        <TextField
          fullWidth
          size="small"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="메시지를 입력하세요"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <IconButton onClick={handleSend}><SendIcon /></IconButton>
      </Box>
    </Box>
  );
}

export default DMChat;