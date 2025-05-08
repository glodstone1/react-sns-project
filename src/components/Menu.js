import React from 'react';
import { Drawer, List, ListItem, ListItemText, Typography, Toolbar, ListItemIcon } from '@mui/material';
import { Home, Add, AccountCircle, Visibility, LocationOn, MailOutline, Image, ReportGmailerrorred } from '@mui/icons-material';
import { Link } from 'react-router-dom';

function Menu() {
  const menuItems = [
    { text: '메인', icon: <Home />, path: '/feed' },
    { text: '등록', icon: <Add />, path: '/register' },
    { text: '마이페이지', icon: <AccountCircle />, path: '/mypage' },
    { text: '목격담 모음', icon: <Visibility />, path: '/sightings' },
    { text: '폐가 탐험기', icon: <LocationOn />, path: '/abandoned' },
    { text: '속삭임 보관함', icon: <MailOutline />, path: '/whispers' },
    { text: '저주받은 갤러리', icon: <Image />, path: '/cursed-gallery' },
    { text: '의심스러운 유저', icon: <ReportGmailerrorred />, path: '/suspects' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#000',
          color: '#fff',
        },
      }}
    >
      <Toolbar />
      <Typography variant="h6" component="div" sx={{ p: 2, color: '#fff', fontFamily: 'Creepster, cursive' }}>
        👻 공포 SNS
      </Typography>
      <List>
        {menuItems.map((item, index) => (
          <ListItem
            button
            key={index}
            component={Link}
            to={item.path}
            sx={{
              color: '#fff',
              textDecoration: 'none',
              '&:hover': {
                backgroundColor: '#1a1a1a',
                color: '#ff1744',
                '& .MuiListItemIcon-root': {
                  color: '#ff1744',
                },
              },
              '&:visited': {
                color: '#fff',
              }
            }}
          >
            <ListItemIcon sx={{ color: '#fff' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default Menu;