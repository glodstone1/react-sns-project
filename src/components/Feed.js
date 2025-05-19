import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, Container, Box, Card, CardMedia, CardContent,
  Dialog, DialogTitle, DialogContent, IconButton, DialogActions, Button,
  TextField, List, ListItem, ListItemText, ListItemAvatar, Avatar, Divider,
  InputLabel, FormControl, Select, MenuItem
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';


function Feed() {
  const [open, setOpen] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [feedList, setFeedList] = useState();
  const [imgList, setImgList] = useState();
  const [fearType, setFearType] = useState("all");
  const [replyTarget, setReplyTarget] = useState(null);

  const token = localStorage.getItem("token");
  const sessionUser = jwtDecode(token);

  const navigate = useNavigate();

  const fnFeedList = (fearType) => {
    if (fearType === 'all') fearType = "";
    fetch("http://localhost:3005/pro-feed/list?type=" + fearType)
      .then(res => res.json())
      .then(data => setFeedList(data.list));
  };

  useEffect(() => {
    fnFeedList(fearType);
  }, []);

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // 0~11
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${yyyy}년 ${mm}월 ${dd}일 ${hh}시 ${min}분`;
  };

  return (
    <Container maxWidth="md" sx={{ backgroundColor: 'rgba(0,0,0,0.6)', color: '#f0f0f0', minHeight: '100vh', py: 4, backdropFilter: 'blur(4px)'  }}>
      <AppBar position="static" sx={{
        bgcolor: '#0d0d0d',
        borderBottom: '2px solid #ff1744',
      }}>
        <Toolbar>
          <Typography
            variant="h4"
            sx={{
              fontFamily: 'Creepster, cursive',
              letterSpacing: 4,
              color: '#ff1744',
              textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
              animation: 'flicker 2.5s infinite alternate'
            }}
          >MAIN FEED</Typography>
        </Toolbar>
      </AppBar>

      <FormControl fullWidth margin="normal">
        <InputLabel sx={{ color: '#fff' }}>카테고리</InputLabel>
        <Select
          value={fearType}
          onChange={(e) => {
            const selected = e.target.value;
            setFearType(selected);
            fnFeedList(selected);
          }}
          label="카테고리"
          sx={{ color: '#fff' }}
        >
          <MenuItem value="all">전체</MenuItem>
          <MenuItem value="real">실화 / 체험담</MenuItem>
          <MenuItem value="watch">목격담 / 제보</MenuItem>
          <MenuItem value="dream">꿈 / 예지몽</MenuItem>
          <MenuItem value="mystery">불가사의 / 미지</MenuItem>
        </Select>
      </FormControl>

      <Box display="flex" flexWrap="wrap" justifyContent="center" gap={3}>
        {feedList && feedList.map(feed => (
          <Box key={feed.POST_ID} sx={{ width: 300 }}>
            <Card
              onClick={() => navigate("/post/" + feed.POST_ID)}
              sx={{
                bgcolor: 'rgba(30, 30, 30, 0.8)', // ✅ 반투명 처리
                color: '#fff',
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: '0 0 12px #ff1744',
                },
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={feed.IMG_PATH && feed.IMG_NAME
                  ? "http://localhost:3005/" + feed.IMG_PATH + feed.IMG_NAME
                  : "/no-image.png"}
              />
              <CardContent sx={{ paddingBottom: '16px !important' }}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    color: '#ff1744',
                    letterSpacing: 1,
                    fontSize: '1.3rem',
                    textShadow: '1px 1px 3px rgba(0, 0, 0, 0.8)'
                  }}
                >
                  {feed.POST_TITLE}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#aaa',
                    fontStyle: 'italic',
                    fontSize: '0.9rem'
                  }}
                >
                  by {feed.NICK_NAME}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: '#666',
                    fontSize: '0.75rem',
                    marginTop: 1,
                    display: 'block'
                  }}
                >
                  {formatDateTime(feed.CDATE_TIME)}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
      <style>
        {`
        @keyframes flicker {
          0%   { opacity: 1; }
          50%  { opacity: 0.8; }
          80%  { opacity: 0.5; transform: scale(1.01); }
          100% { opacity: 1; }
        }
      `}
      </style>
    </Container>
  );
}

export default Feed;