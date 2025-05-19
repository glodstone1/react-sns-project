import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar, Stack } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Header() {
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const navigate = useNavigate();

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
        py: 1.5,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        color: '#fff',
        borderBottom: '1px solid #333',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 1,
          fontFamily: 'Creepster, cursive',
          color: '#ff1744',
          letterSpacing: 3,
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

      <Box sx={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
        {suggestedUsers.length === 0 ? (
          <Box
            sx={{
              height: 80,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#888',
              fontStyle: 'italic',
            }}
          >
            SEARCHING COMPANIONS...
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
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    color: '#ff1744',
                  },
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
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    fontSize: 12,
                    fontWeight: 'bold',
                  }}
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