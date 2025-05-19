import React, { useState } from 'react';
import {
  Box, TextField, Button, Avatar, Typography,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import DMList from './DMList';
import DMChat from './DMChat';
import { jwtDecode } from 'jwt-decode';

function DMPage() {
  const token = localStorage.getItem('token');
  const sessionUser = token ? jwtDecode(token) : null;
  const myEmail = sessionUser?.email;

  const [targetEmail, setTargetEmail] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [msg, setMsg] = useState('');
  const [open, setOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSearch = async () => {
    const res = await fetch(`http://localhost:3005/pro-chat/search?keyword=${keyword}`);
    const json = await res.json();
    if (json.result === 'success') {
      setResults(json.data);
    }
  };

  const handleSend = async () => {
    await fetch('http://localhost:3005/pro-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sender: myEmail,
        receiver: selectedUser.USER_EMAIL,
        content: msg
      })
    });

    setOpen(false);
    setMsg('');
    setResults([]);
    setKeyword('');
    setTargetEmail(selectedUser.USER_EMAIL);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Box
      sx={{
        marginLeft: '240px',
        minHeight: '100vh',
        bgcolor: '#111',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        px: 2
      }}
    >
      {/* 🔍 검색창 */}
      <Box
        display="flex"
        gap={1}
        mt={4}
        mb={2}
        sx={{ width: '100%', maxWidth: 700 }}
      >
        <TextField
          fullWidth
          size="small"
          variant="outlined"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="닉네임 또는 이메일 검색"
          sx={{
            backgroundColor: '#1a1a1a',
            borderRadius: 1,
            input: { color: '#fff' },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#444'
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#ff1744'
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#ff1744'
            }
          }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          sx={{
            backgroundColor: '#d50000',
            '&:hover': { backgroundColor: '#ff1744' }
          }}
        >
          검색
        </Button>
      </Box>

      {/* 🔍 검색 결과 리스트 */}
      <Box sx={{ width: '100%', maxWidth: 700 }}>
        {results.map((user) => (
          <Box
            key={user.USER_EMAIL}
            display="flex"
            alignItems="center"
            p={1}
            borderBottom="1px solid #444"
          >
            <Avatar src={user.PROFILE_IMG || '/default-profile.png'} />
            <Box ml={2} flexGrow={1}>
              <Typography>{user.NICK_NAME}</Typography>
              <Typography variant="caption" sx={{ color: '#999' }}>{user.USER_EMAIL}</Typography>
            </Box>
            <Button
              variant="outlined"
              onClick={() => {
                setSelectedUser(user);
                setOpen(true);
              }}
              sx={{
                color: '#fff',
                borderColor: '#666',
                '&:hover': {
                  borderColor: '#ff1744',
                  color: '#ff1744'
                }
              }}
            >
              💬 속삭이기
            </Button>
          </Box>
        ))}
      </Box>

      {/* 💬 메시지 입력 모달 */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{selectedUser?.NICK_NAME}에게 속삭이기</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="메시지를 입력하세요"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSend}>보내기</Button>
          <Button onClick={() => setOpen(false)}>취소</Button>
        </DialogActions>
      </Dialog>

      {/* 📬 DM 목록 + 채팅창 */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="flex-start"
        mt={4}
        sx={{ width: '100%', maxWidth: 1000, minHeight: '500px' }}
      >
        <DMList myEmail={myEmail} onSelectUser={setTargetEmail} refreshKey={refreshKey} />
        <DMChat myEmail={myEmail} targetEmail={targetEmail} reloadKey={refreshKey} />
      </Box>
    </Box>
  );
}

export default DMPage;