import React from 'react';
import { Box, Typography, Avatar, Stack } from '@mui/material';

const fakeUsers = [
  { id: 1, name: 'ghost_hunter', avatar: '/avatars/ghost1.png' },
  { id: 2, name: 'nightcrawler', avatar: '/avatars/ghost2.png' },
  { id: 3, name: 'shadowseer', avatar: '/avatars/ghost3.png' },
  { id: 4, name: 'haunted_soul', avatar: '/avatars/ghost4.png' },
  { id: 5, name: 'creepwatch', avatar: '/avatars/ghost5.png' },
  { id: 6, name: 'phantomgirl', avatar: '/avatars/ghost6.png' },
];

function Header() {
  return (
    <Box
      sx={{
        width: '100%',
        marginLeft: '15%',
        px: 2,
        py: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // ✅ 반투명 배경
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
        <Stack direction="row" spacing={2}>
          {fakeUsers.map((user) => (
            <Box
              key={user.id}
              sx={{
                display: 'inline-block',
                textAlign: 'center',
                color: '#ccc',
              }}
            >
              <Avatar
                src={user.avatar}
                alt={user.name}
                sx={{
                  width: 56,
                  height: 56,
                  margin: '0 auto',
                  border: '2px solid #ff1744',
                }}
              />
              <Typography variant="body2" sx={{ mt: 1, fontSize: 12 }}>
                {user.name}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}

export default Header;