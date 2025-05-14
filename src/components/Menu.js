import React, { useEffect, useState } from 'react';
import {
  Drawer, List, ListItem, ListItemText, Typography, Toolbar, ListItemIcon, Badge
} from '@mui/material';
import {
  Home, Add, AccountCircle, Visibility, LocationOn,
  MailOutline, Image, ReportGmailerrorred
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function Menu() {
  const token = localStorage.getItem('token');
  const sessionUser = token ? jwtDecode(token) : null;
  const myEmail = sessionUser?.email;

  const [notiCount, setNotiCount] = useState(0);

  // ✅ 알림 개수 불러오기 (mount 시 1회만, 또는 주기적으로도 가능)
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!myEmail) return;
      const res = await fetch(`/api/notification?user=${myEmail}`);
      const data = await res.json();
      setNotiCount(data.filter(n => n.IS_READ === 'N').length); // 안읽은 것만 카운트
    };
    fetchNotifications();
  }, [myEmail]);

  const menuItems = [
    { text: '메인', icon: <Home />, path: '/feed' },
    { text: '등록', icon: <Add />, path: '/register' },
    { text: '마이페이지', icon: <AccountCircle />, path: myEmail ? `/mypage/${encodeURIComponent(myEmail)}` : '/prologin' },
    { text: '동행자 찾기', icon: <Visibility />, path: '/followerlist' },
    { text: '나의 동행자 목록', icon: <Visibility />, path: '/myfollowinglist' },
    { text: '나의 추종자 목록', icon: <Visibility />, path: '/myfollowerslist' },
    {
      text: '속삭임 보관함',
      icon: (
        <Badge badgeContent={notiCount} color="error">
          <MailOutline />
        </Badge>
      ),
      path: '/notificationlist'
    },
    { text: '목격담 모음', icon: <Visibility />, path: '/sightings' },
    { text: '폐가 탐험기', icon: <LocationOn />, path: '/abandoned' },
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
              },
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