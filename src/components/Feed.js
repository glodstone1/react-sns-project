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

  const handleClickOpen = (feed) => {
    fetch("http://localhost:3005/pro-feed/" + feed.POST_ID)
      .then(res => res.json())
      .then(data => {
        setSelectedFeed(data.feed);
        setImgList(data.imgList);
        // ✅ 정렬: 댓글 ID 오름차순으로 (부모 다음에 자식이 오게)
        const sorted = data.commList.sort((a, b) => a.COMMENT_ID - b.COMMENT_ID);
        setComments(sorted);
      });
    setOpen(true);
    setNewComment('');
    setReplyTarget(null);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFeed(null);
    setComments([]);
    setReplyTarget(null);
  };

  const handleAddComment = (postId, parentId = null) => {
    if (!newComment.trim()) {
      alert("댓글을 작성해주십시오.");
      return;
    }
    fetch("http://localhost:3005/pro-feed/comment", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        postId: postId,
        comment: newComment,
        email: sessionUser.email,
        parentId: parentId
      })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        setNewComment('');
        setReplyTarget(null);
        fetch("http://localhost:3005/pro-feed/" + postId)
          .then(res => res.json())
          .then(data => {
            const sorted = data.commList.sort((a, b) => a.COMMENT_ID - b.COMMENT_ID);
            setComments(sorted);
          });
      });
  };

  return (
    <Container maxWidth="md" sx={{ backgroundColor: 'rgba(0,0,0,0.6)', color: '#f0f0f0', minHeight: '100vh', py: 4 ,backdropFilter: 'blur(4px)'}}>
      <AppBar position="static" sx={{ bgcolor: '#1b1b1b' }}>
        <Toolbar>
          <Typography variant="h5" sx={{ fontFamily: 'Creepster, cursive', letterSpacing: 2 }}>GhostFeed</Typography>
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
            <Card onClick={() => navigate("/post/" + feed.POST_ID)} sx={{ bgcolor: '#1e1e1e', color: '#fff', cursor: 'pointer' }}>
              <CardMedia
                component="img"
                height="200"
                image={feed.IMG_PATH && feed.IMG_NAME ? "http://localhost:3005/" + feed.IMG_PATH + feed.IMG_NAME : "/no-image.png"}
              />
              <CardContent>
                <Typography>{feed.POST_TITLE}</Typography>
                <Typography>{feed.NICK_NAME}</Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Container>
  );
}

export default Feed;