import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Stack } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // ✅ navigate 사용

function Header() {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const navigate = useNavigate(); // ✅ useNavigate 훅

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3005/pro-user/suggested-users?limit=6', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log("추천 유저 응답", response.data);
        setSuggestedUsers(response.data);
      } catch (err) {
        console.error('추천 유저 가져오기 실패:', err);
      }
    };

    fetchSuggestedUsers();
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        marginLeft: '15%',
        px: 2,
        py: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        color: '#fff',
        borderBottom: '1px solid #333',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      <Typography variant="h6" sx={{ mb: 1, fontFamily: 'Creepster, cursive' }}>
        팔로우 추천 👁
      </Typography>
      <Box sx={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
        {suggestedUsers.length === 0 ? (
          <Box
            sx={{
              height: 80, // ✅ 추천 아바타 높이에 맞춤
              alignItems: 'center',
              justifyContent: 'center',
              color: '#aaa',
            }}
          >
            동행자 찾는 중...
          </Box>
        ) : (
          <Stack direction="row" spacing={2}>
            {suggestedUsers.map((user, index) => (
              <Box
                key={index}
                sx={{
                  display: 'inline-block',
                  textAlign: 'center',
                  color: '#ccc',
                  cursor: 'pointer'
                }}
                onClick={() => navigate(`/mypage/${encodeURIComponent(user.USER_EMAIL)}`)}
              >
                <Avatar
                  src={
                    user.PROFILE_IMG
                      ? `http://localhost:3005/${user.PROFILE_IMG}`
                      : ''
                  }
                  alt={user.NICK_NAME}
                  sx={{
                    width: 56,
                    height: 56,
                    margin: '0 auto',
                    border: '2px solid #ff1744',
                    cursor: 'pointer'
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{ mt: 1, fontSize: 12 }}
                >
                  {user.NICK_NAME}
                </Typography>
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
}

export default Header;