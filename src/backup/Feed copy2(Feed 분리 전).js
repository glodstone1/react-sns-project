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
              {/* <Card onClick={() => handleClickOpen(feed)} sx={{ bgcolor: '#1e1e1e', color: '#fff', cursor: 'pointer' }}> */}
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

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg" scroll="paper">
        <DialogTitle sx={{ bgcolor: '#1b1b1b', color: '#fff' }}>
          {selectedFeed?.POST_TITLE}
          <IconButton onClick={handleClose} sx={{ position: 'absolute', right: 8, top: 8, color: '#fff' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ display: 'flex', bgcolor: '#121212' }}>
          <Box sx={{ flex: 1, overflowY: 'auto', pr: 2 }}>

            <Typography>
              <div style={{ whiteSpace: 'pre-line' }}>
                {selectedFeed?.POST_CONTENT}
              </div>
            </Typography>
            {imgList && imgList.map((item, index) => (
              <Box key={index} mb={2}>
                <img src={`http://localhost:3005/${item.IMG_PATH}${item.IMG_NAME}`} alt="" style={{ width: '100%' }} />
              </Box>
            ))}
          </Box>

          <Box sx={{ width: 300, ml: 2 }}>
            <Typography variant="h6">👻 댓글</Typography>
            <List>
              {comments.map(comment => (
                <Box key={comment.COMMENT_ID}>
                  {/* ✅ 부모 댓글만 표시 */}
                  {!comment.PARENT_ID && (
                    <>
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar src={comment.PROFILE_IMG ? "http://localhost:3005/" + comment.PROFILE_IMG : ""}>
                            {comment.NICK_NAME.charAt(0).toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={comment.NICK_NAME} secondary={comment.CONTENT} />
                      </ListItem>

                      {/* ✅ 답글 버튼 클릭 시 toggle 동작 */}
                      <Box textAlign="right" px={1}>
                        <Button
                          size="small"
                          onClick={() => {
                            // 같은 댓글 클릭 시 닫힘
                            if (replyTarget === comment.COMMENT_ID) {
                              setReplyTarget(null);
                            } else {
                              setReplyTarget(comment.COMMENT_ID);
                            }
                          }}
                          sx={{ fontSize: 12, color: '#888' }}
                        >
                          답글
                        </Button>
                      </Box>

                      {/* ✅ 대댓글 렌더링 */}
                      {comments
                        .filter(r => r.PARENT_ID === comment.COMMENT_ID)
                        .map(reply => (
                          <ListItem key={reply.COMMENT_ID} sx={{ pl: 6, backgroundColor: '#1a1a1a' }}>
                            <ListItemAvatar>
                              <Avatar src={reply.PROFILE_IMG ? "http://localhost:3005/" + reply.PROFILE_IMG : ""}>
                                {reply.NICK_NAME.charAt(0).toUpperCase()}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={`↪️ ${reply.NICK_NAME}`} secondary={reply.CONTENT} />
                          </ListItem>
                        ))}

                      {/* ✅ 대댓글 입력창: 선택된 댓글 아래만 */}
                      {replyTarget === comment.COMMENT_ID && (
                        <Box sx={{ pl: 6, mb: 1 }}>
                          <TextField
                            fullWidth
                            placeholder={`${comment.NICK_NAME}님에게 답글 작성`}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            size="small"
                            sx={{ mt: 1 }}
                          />
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => handleAddComment(selectedFeed.POST_ID, comment.COMMENT_ID)}
                            sx={{ mt: 1 }}
                          >
                            답글 달기
                          </Button>
                        </Box>
                      )}

                      <Divider variant="inset" component="li" sx={{ borderColor: '#444' }} />
                    </>
                  )}
                </Box>
              ))}
            </List>

            {/* ✅ 기본 댓글 입력창: 대댓글 입력 중이 아닐 때만 표시 */}
            {!replyTarget && (
              <Box mt={2}>
                <TextField
                  fullWidth
                  label="당신의 소름돋는 생각은?"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  sx={{ input: { color: '#fff' }, label: { color: '#bbb' } }}
                />
                <Button
                  variant="contained"
                  color="error"
                  fullWidth
                  onClick={() => handleAddComment(selectedFeed.POST_ID)}
                  sx={{ mt: 1 }}
                >
                  댓글 추가
                </Button>
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ bgcolor: '#1b1b1b' }}>
          <Button onClick={handleClose} sx={{ color: '#fff' }}>닫기</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default Feed;