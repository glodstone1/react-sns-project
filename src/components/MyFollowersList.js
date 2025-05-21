import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  List, ListItem, ListItemAvatar, ListItemText,
  Avatar, Button, Box, Typography, TextField, Paper, Dialog, DialogTitle, DialogActions
} from '@mui/material';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

function MyFollowersList() {
  const [followerUsers, setFollowerUsers] = useState([]);
  const [myFollowList, setMyFollowList] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const searchTimeoutRef = useRef(null);
  const navigate = useNavigate();
  const { email } = useParams();

  let sessionUserEmail = null;
  try {
    const token = localStorage.getItem("token");
    sessionUserEmail = token ? jwtDecode(token).email : null;
  } catch (e) {
    console.error("JWT 파싱 오류:", e);
    localStorage.removeItem("token");
    window.location.href = "/login";
  }

  const userEmail = email || sessionUserEmail;

  const fetchFollowerUsers = async (searchTerm = '') => {
    try {
      const res = await axios.get('http://localhost:3005/pro-user/follow-list', {
        params: { keyword: searchTerm, email: userEmail, type: 'followers' },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setFollowerUsers(res.data);
    } catch (err) {
      console.error("팔로워 유저 조회 실패:", err);
    }
  };

  const fetchMyFollowList = async () => {
    try {
      const res = await axios.get('http://localhost:3005/pro-user/follow-list', {
        params: { email: sessionUserEmail, type: 'following' },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setMyFollowList(res.data.map(user => user.USER_EMAIL));
    } catch (err) {
      console.error("내 팔로우 목록 조회 실패:", err);
    }
  };

  useEffect(() => {
    if (userEmail) {
      fetchFollowerUsers();
      fetchMyFollowList();
    }
  }, [userEmail]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setKeyword(value);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      fetchFollowerUsers(value);
    }, 300);
  };

  const handleUnfollow = async () => {
    try {
      await axios.delete('http://localhost:3005/pro-follow', {
        data: { follower: sessionUserEmail, following: selectedEmail },
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setMyFollowList(prev => prev.filter(email => email !== selectedEmail));
      setCancelDialogOpen(false);
    } catch (err) {
      alert("동행 취소 실패");
    }
  };

  const handleFollow = async (targetEmail) => {
    try {
      await axios.post('http://localhost:3005/pro-follow', {
        follower: sessionUserEmail,
        following: targetEmail
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setMyFollowList(prev => [...prev, targetEmail]);
    } catch (err) {
      alert("동행 요청 실패");
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        maxWidth: 500,
        minHeight: 1000,
        margin: '0 auto',
        p: 4,
        color: "#ddd",
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: 3,
        boxShadow: '0 0 20px rgba(255, 0, 0, 0.2)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        transition: '0.3s',
        '&:hover': {
          boxShadow: '0 0 30px rgba(255, 0, 0, 0.4)',
          transform: 'scale(1.01)'
        }
      }}
    >
      <Box sx={{ maxWidth: 500, margin: '0 auto', mt: 4, px: 2 }}>
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
          👁️ {userEmail === sessionUserEmail ? 'My Followers' : `${userEmail}’s Followers`}
        </Typography>
        <style>{`
          @keyframes flicker {
            0% { opacity: 1; }
            50% { opacity: 0.85; }
            80% { opacity: 0.6; transform: scale(1.01); }
            100% { opacity: 1; }
          }
        `}</style>

        <TextField
          size="small"
          fullWidth
          value={keyword}
          onChange={handleSearch}
          placeholder="닉네임 또는 이메일 검색"
          sx={{ mb: 2, backgroundColor: '#111', input: { color: '#fff' } }}
          InputProps={{ style: { fontSize: 14 } }}
        />

        <List>
          {followerUsers.map((user, idx) => (
            <ListItem key={idx}
              sx={{
                borderBottom: '1px solid #333',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 1,
                py: 1.5,
                borderRadius: 2,
                transition: 'background-color 0.2s, outline 0.2s',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                }
              }}
            >
              <Box
                sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                onClick={() => navigate(`/mypage/${encodeURIComponent(user.USER_EMAIL)}`)}
              >
                <ListItemAvatar>
                  <Avatar src={`http://localhost:3005/${user.PROFILE_IMG}`} />
                </ListItemAvatar>
                <ListItemText
                  primary={user.NICK_NAME}
                  secondary={user.USER_EMAIL}
                  sx={{ ml: 1 }}
                />
              </Box>
              {user.USER_EMAIL === sessionUserEmail ? (
                <Button disabled sx={{ opacity: 0.8 }}>🕯️ 나</Button>
              ) : myFollowList.includes(user.USER_EMAIL) ? (
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => {
                    setSelectedEmail(user.USER_EMAIL);
                    setCancelDialogOpen(true);
                  }}
                >
                  🕯️ 동행 중
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleFollow(user.USER_EMAIL)}
                >
                  👁️ 동행자 요청
                </Button>
              )}
            </ListItem>
          ))}
          {followerUsers.length === 0 && (
            <Typography sx={{ textAlign: 'center', color: '#aaa', mt: 4 }}>
              현재 추종 중인 사람이 없습니다.
            </Typography>
          )}
        </List>
      </Box>

      <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
        <DialogTitle>동행을 포기하겠습니까?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setCancelDialogOpen(false)}>아니오</Button>
          <Button onClick={handleUnfollow} color="error">예</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}

export default MyFollowersList;