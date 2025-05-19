import React, { useEffect } from 'react';
import {
  Drawer, List, ListItem, ListItemText, Typography, Toolbar, ListItemIcon, Badge
} from '@mui/material';


import {
  Home as HomeIcon,
  AddBox as AddBoxIcon,
  Person as PersonIcon,
  PeopleAlt as PeopleAltIcon,
  Group as GroupIcon,
  GroupAdd as GroupAddIcon,
  Mail as MailIcon,
  Chat as ChatIcon,
  Home, Add, AccountCircle, Visibility, LocationOn,
  Image, ReportGmailerrorred, MailOutline
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useRecoilValue } from 'recoil'; // ✅ 이거 추가!
import { unreadCountState } from './unreadCountAtom'; // ✅ 경로 조정

function Menu() {
  const token = localStorage.getItem('token');
  const sessionUser = token ? jwtDecode(token) : null;
  const myEmail = sessionUser?.email;

  const unreadCount = useRecoilValue(unreadCountState); // ✅ 전역 상태 읽기만

  const menuItems = [
    { text: '메인', icon: <HomeIcon />, path: '/feed' }, // 🏠 기본 홈
    { text: '이야기 등록', icon: <AddBoxIcon />, path: '/register' }, // ➕ 등록
    { text: '나의 정보', icon: <PersonIcon />, path: myEmail ? `/mypage/${encodeURIComponent(myEmail)}` : '/prologin' }, // 👤 프로필
    { text: '동행자 찾기', icon: <Visibility />, path: '/followerlist' }, // 🧑‍🤝‍🧑 유저 탐색
    { text: '나의 동행자 목록', icon: <GroupIcon />, path: '/myfollowinglist' }, // 👥 following
    { text: '나의 추종자 목록', icon: <GroupAddIcon />, path: '/myfollowerslist' }, // 👤+ 추종자
    {
      text: '속삭임 보관함',
      icon: (
        <Badge badgeContent={unreadCount} color="error">
          <MailIcon />
        </Badge>
      ),
      path: '/notificationlist'
    }, // ✉️ 알림
    { text: '1대1 대화', icon: <ChatIcon />, path: '/dmpage' }, // 💬 DM
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
      <Typography
        variant="h5" // 기존 h6 → h5로 글씨 키움
        component="div"
        align="center" // ✅ 중앙 정렬
        sx={{
          p: 3,
          color: '#ff1744',
          fontFamily: 'Creepster, cursive',
          letterSpacing: 3,
          textShadow: '1px 1px 4px rgba(0,0,0,0.8)',
          animation: 'flicker 2.5s infinite alternate',
        }}
      >
        MENU
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