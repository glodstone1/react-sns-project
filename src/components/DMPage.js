import React, { useState } from 'react';
import { Box, TextField, Button, Avatar, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DMList from './DMList';
import DMChat from './DMChat';
import { jwtDecode } from 'jwt-decode';

function DMPage() {
  const token = localStorage.getItem('token');
  const sessionUser = token ? jwtDecode(token) : null;
  const myEmail = sessionUser?.email;
  const [targetEmail, setTargetEmail] = useState(null);

  // ✅ 검색/모달 상태들
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [msg, setMsg] = useState('');
  const [open, setOpen] = useState(false);

  const [refreshKey, setRefreshKey] = useState(0); // ✅ DMList 강제 리렌더링용 상태값

  // 🔍 유저 검색 요청
  const handleSearch = async () => {
    const res = await fetch(`http://localhost:3005/pro-chat/search?keyword=${keyword}`);
    const json = await res.json();
    if (json.result === 'success') {
      setResults(json.data);
    }
  };

  // 💬 메시지 전송 후 상태 갱신
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

    // ✅ 모달 닫고 상태 초기화
    setOpen(false);
    setMsg('');
    setResults([]);
    setKeyword('');

    // ✅ 대화창 이동 + 목록 리렌더링 트리거
    setTargetEmail(selectedUser.USER_EMAIL);
    setRefreshKey(prev => prev + 1); // ✅ DMList 다시 불러오게 함
  };

  return (
    <Box sx={{ marginLeft: '240px' }} height="100vh" bgcolor="#111" color="#fff">
      
      {/* 🔍 상단 검색창 */}
      <Box display="flex" gap={1} p={2}>
        <TextField
          label="유저 검색 (닉네임/이메일)"
          size="small"
          variant="outlined"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          sx={{ backgroundColor: '#fff', borderRadius: 1 }}
        />
        <Button variant="contained" onClick={handleSearch}>검색</Button>
      </Box>

      {/* 🔍 검색 결과 리스트 */}
      {results.map((user) => (
        <Box key={user.USER_EMAIL} display="flex" alignItems="center" p={1} borderBottom="1px solid #444" ml={2}>
          <Avatar src={user.PROFILE_IMG || '/default-profile.png'} />
          <Box ml={2} flexGrow={1}>
            <Typography>{user.NICK_NAME}</Typography>
            <Typography variant="caption">{user.USER_EMAIL}</Typography>
          </Box>
          <Button variant="outlined" onClick={() => { setSelectedUser(user); setOpen(true); }}>
            💬 속삭이기
          </Button>
        </Box>
      ))}

      {/* 💬 메시지 입력 모달 */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{selectedUser?.NICK_NAME}에게 속삭이기</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth multiline rows={4}
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
      <Box display="flex" height="80%">
        {/* ✅ refreshKey를 DMList에 전달 */}
        <DMList myEmail={myEmail} onSelectUser={setTargetEmail} refreshKey={refreshKey} />
        <DMChat myEmail={myEmail} targetEmail={targetEmail} reloadKey={refreshKey} />
      </Box>
    </Box>
  );
}

export default DMPage;