import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  List, ListItem, ListItemAvatar, ListItemText,
  Avatar, Button, Box, Typography, TextField, Paper
} from '@mui/material';
import axios from 'axios';

function FollowerList() {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [keyword, setKeyword] = useState('');
  const searchTimeoutRef = useRef(null); // ✅ 타이머 ref 선언
  const navigate = useNavigate();

  const fetchSuggestedUsers = async (searchTerm = '') => {
    try {
      const res = await axios.get('http://localhost:3005/pro-user/suggested-users', {
        params: {
          keyword: searchTerm,
          limit: 'all'
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setSuggestedUsers(res.data);
    } catch (err) {
      console.error("추천 유저 조회 실패:", err);
    }
  };

  useEffect(() => {
    fetchSuggestedUsers(); // 초기 로딩
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setKeyword(value);

    // 이전 타이머 취소
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // 새 타이머 등록 (300ms 후 실행)
    searchTimeoutRef.current = setTimeout(() => {
      fetchSuggestedUsers(value);
    }, 300);
  };

  const handleFollow = (targetEmail) => {
    axios.post('http://localhost:3005/pro-follow', {
      follower: JSON.parse(atob(localStorage.getItem('token').split('.')[1])).email,
      following: targetEmail
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }).then(res => {
      if (res.data.success) {
        alert("동행자 요청 완료!");
        setSuggestedUsers(prev => prev.filter(user => user.USER_EMAIL !== targetEmail));
      } else {
        alert("요청 실패");
      }
    });
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        maxWidth: 500, // ✅ 카드 최대 너비 제한
        minHeight: 1000,
        margin: '0 auto', // ✅ 중앙 정렬
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
          SUGGESTED COMPANIONS
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
        {/* ✅ 검색창 */}
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
          {suggestedUsers.map((user, idx) => (
            <ListItem key={idx}
              sx={{
                borderBottom: '1px solid #333',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 1
              }}
            >
              <ListItem
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
                {/* 유저 정보 클릭 가능 부분 */}
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

                {/* 오른쪽 동행자 버튼은 그대로 작동 */}
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleFollow(user.USER_EMAIL)}
                >
                  동행자 요청
                </Button>
              </ListItem>
            </ListItem>
          ))}
          {suggestedUsers.length === 0 && (
            <Typography sx={{ textAlign: 'center', color: '#aaa', mt: 4 }}>
              추천할 동행자가 없습니다.
            </Typography>
          )}
        </List>
      </Box>
    </Paper>
  );
}

export default FollowerList;