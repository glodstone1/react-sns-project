import React, { useState, useEffect } from 'react';
import {
  Grid2,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Card,
  CardMedia,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  ImageList,
  ImageListItem,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { darken } from '@mui/system';


function Feed() {
  const [open, setOpen] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [comments, setComments] = useState([]);
  const [testComm, setTestComm] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [feedList, setFeedList] = useState();
  const [imgList, setImgList] = useState();
  const [fearType, setFearType] = useState("all");

  const fnFeedList = (fearType) => {
    if (fearType == 'all') {
      fearType = ""
    }
    fetch("http://localhost:3005/pro-feed/list?type=" + fearType)
      .then(res => res.json())
      .then(data => setFeedList(data.list));
  }



  useEffect(() => {
    fnFeedList(fearType);
  }, [])

  const handleClickOpen = (feed) => {
    fetch("http://localhost:3005/pro-feed/" + feed.POST_ID)
      .then(res => res.json())
      .then(data => {
        setSelectedFeed(data.feed);
        setImgList(data.imgList);
        setTestComm(data.commList);

      })


    setOpen(true);
    // setComments([
    //   { id: 'user1', text: '멋진 사진이에요!' },
    //   { id: 'user2', text: '이 장소에 가보고 싶네요!' },
    //   { id: 'user3', text: '아름다운 풍경이네요!' },
    // ]); // 샘플 댓글 추가
    setNewComment(''); // 댓글 입력 초기화
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFeed(null);
    setComments([]);
    setTestComm([]);
  };

  const handleAddComment = (newComment) => {
    fetch("http://localhost:3005/pro-feed", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body:
        JSON.stringify({
        })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
      });
  };

  // const handleAddComment = () => {
  //   if (newComment.trim()) {
  //     setComments([...comments, { id: 'currentUser', text: newComment }]);
  //     setTestComm([...testComm, { id: testComm.NICK_NAME, text: newComment }]);
  //     setNewComment('');
  //   }
  // };

  return (
    <Container maxWidth="md" sx={{
      bgcolor: '#121212', color: '#f0f0f0', minHeight: '100vh', py: 4,
      padding: '20px',
      backgroundColor: 'rgba(0,0,0,0.6)',
      borderRadius: 3,
      color: '#fff',
      boxShadow: '0 0 10px rgba(255, 0, 0, 0.3)',
      backdropFilter: 'blur(5px)'
    }}>
      <AppBar position="static" sx={{ bgcolor: '#1b1b1b' }}>
        <Toolbar>
          <Typography variant="h5" sx={{ fontFamily: 'Creepster, cursive', letterSpacing: 2 }}>GhostFeed</Typography>
        </Toolbar>
      </AppBar>
      <FormControl fullWidth margin="normal">
        <InputLabel sx={{ color: '#fff' }}>카테고리</InputLabel>
        <Select value={fearType} // 선택된 값 반영
          onChange={(e) => {
            const selected = e.target.value;
            setFearType(selected);
            fnFeedList(selected); // ✅ 정확하게 넘기기
          }}
          label="카테고리"
          sx={{ color: '#fff', borderColor: '#fff' }}>
          <MenuItem value={"all"}>전체</MenuItem>
          <MenuItem value={"real"}>실화 / 체험담</MenuItem>
          <MenuItem value={"watch"}>목격담 / 제보</MenuItem>
          <MenuItem value={"dream"}>꿈 / 예지몽</MenuItem>
          <MenuItem value={"mystery"}>불가사의 / 미지</MenuItem>
        </Select>
      </FormControl>
      <Box
        display="flex"
        flexWrap="wrap"
        justifyContent="center"
        gap={3}
      >
        {feedList && feedList.map((feed) => (
          <Box key={feed.POST_ID}
            sx={{ width: 300 }}
          >
            {/* ✅ 카드 너비 고정 (300px) */}
            <Card sx={{
              bgcolor: '#1e1e1e', color: '#fff',
              cursor: 'pointer',
              filter: 'brightness(70%)',
              '&:hover': { filter: 'brightness(90%)' }
            }} onClick={() => handleClickOpen(feed)}>
              <CardMedia
                component="img"
                height="200"
                image={
                  feed.IMG_PATH && feed.IMG_NAME
                    ? "http://localhost:3005/" + feed.IMG_PATH + feed.IMG_NAME
                    : "/no-image.png" // ✅ 기본 이미지 (public 폴더에 위치)
                }
                alt={feed.POST_TITLE}
              />
              <CardContent>
                <Typography variant="body2" color="text.secondary">
                  {feed.POST_TITLE}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feed.NICK_NAME}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>


      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg" scroll="paper">
        <DialogTitle sx={{ bgcolor: '#1b1b1b', color: '#fff' }}>
          {selectedFeed?.POST_TITLE}
          <IconButton
            edge="end"
            onClick={handleClose}
            sx={{ position: 'absolute', right: 8, top: 8, color: '#fff' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ display: 'flex', bgcolor: '#121212', color: '#f0f0f0' }}>
          <Box sx={{ flex: 1, overflowY: 'auto', pr: 2 }}>
            <Typography variant="body1" gutterBottom>
              {selectedFeed?.POST_CONTENT}
            </Typography>

            {imgList && imgList.length > 0 && (
              <Box mt={2}>
                {imgList.map((item, index) => (
                  <Box key={index} mb={2}>
                    <img
                      src={`http://localhost:3005/${item.IMG_PATH}${item.IMG_NAME}`}
                      alt={item.IMG_NAME}
                      style={{
                        width: '100%',
                        height: 'auto',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                      }}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          <Box sx={{ width: '300px', marginLeft: '20px', flexShrink: 0 }}>
            <Typography variant="h6">👻 댓글</Typography>
            <List>
              {testComm.map((testComm, index) => (
                <React.Fragment key={index}>
                  <ListItem sx={{ color: '#ddd', alignItems: 'flex-start' }}>
                    <ListItemAvatar>
                      <Avatar
                        src={testComm.PROFILE_IMG ? "http://localhost:3005/" + testComm.PROFILE_IMG : ""}
                        sx={{
                          width: 60,
                          height: 60,
                          marginTop: '4px', // ✅ 프로필 사진 아래로 약간 내림
                          border: '2px solid #ff1744',
                          cursor: 'pointer'
                        }}
                      >
                        {testComm.NICK_NAME.charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>

                    <ListItemText
                      sx={{ ml: 2 }}
                      primary={testComm.NICK_NAME}
                      secondary={testComm.CONTENT}
                    />
                  </ListItem>

                  {/* ✅ 댓글 사이에 구분선 */}
                  <Divider variant="inset" component="li" sx={{ borderColor: '#444' }} />
                </React.Fragment>
              ))}
            </List>
            <TextField
              label="당신의 소름돋는 생각은?"
              variant="outlined"
              fullWidth
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              sx={{ input: { color: '#fff' }, label: { color: '#bbb' }, mt: 1 }}
            />
            <Button
              variant="contained"
              color="error"
              onClick={handleAddComment}
              sx={{ marginTop: 1 }}
            >
              댓글 추가
            </Button>
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