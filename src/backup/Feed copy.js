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
  ImageList,
  ImageListItem
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { darken } from '@mui/system';

const mockFeeds = [
  {
    id: 1,
    title: '폐가에서 들려온 속삭임',
    description: '한밤중 폐가를 지나던 중, 누군가의 속삭임이 들렸다. 하지만 그곳엔 아무도 없었다...',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8u1gUw85nL-aRmCjU4PjH9qX0__VOOhPaseQG5oQzx1OxjtBXtTolzxi83glF-K9AwNc&usqp=CAU',
  },
  {
    id: 2,
    title: '거울 속의 나',
    description: '거울을 봤는데, 나와 눈을 마주친 그 존재는 나보다 먼저 웃고 있었다.',
    image: 'https://us.123rf.com/450wm/zeferli/zeferli1802/zeferli180200067/95115617-%EC%96%B4%EB%91%90%EC%9A%B4-%ED%86%A4%EB%90%9C-%EC%95%88%EA%B0%9C-%EB%B0%B0%EA%B2%BD%EC%97%90%EC%84%9C-%EC%98%A4%EB%9E%98-%EB%90%9C-%EC%86%8C-%EB%A6%84-%EC%84%AC%EB%9C%A9%ED%95%9C-%EB%82%98%EB%AC%B4-%EC%95%84%EA%B8%B0-%EC%B9%A8%EB%8C%80-%EA%B3%B5%ED%8F%AC-%EA%B0%9C%EB%85%90-%EC%96%B4%EB%91%A0-%EC%86%8D%EC%97%90%EC%84%9C-%EB%AC%B4%EC%84%9C%EC%9A%B4-%EC%95%84%EA%B8%B0%EC%99%80-%EC%B9%A8%EB%8C%80-%EC%8B%A4%EB%A3%A8%EC%97%A3%EC%9E%85%EB%8B%88%EB%8B%A4-%ED%95%A0%EB%A1%9C%EC%9C%88-%EC%9E%A5%EC%8B%9D-%EC%83%B7-%EC%84%A0%ED%83%9D%EC%A0%81.jpg?ver=6',
  },
  {
    id: 3,
    title: '혼자 사는 집에서 울린 발소리',
    description: '새벽 3시. 혼자 있는 집에서 천천히 걸어오는 발소리가 들렸다. 경찰은 아무도 없었다고 했다.',
    image: 'https://www.shutterstock.com/image-photo/scary-shadow-mirror-halloween-concept-260nw-1541764574.jpg',
  },
  {
    id: 4,
    title: '문틈 아래서 보인 손',
    description: '잠들기 전 방문 아래 틈 사이로 손가락이 들어왔다. 가족들은 모두 자고 있었다.',
    image: 'https://us.123rf.com/450wm/yupachingping/yupachingping2001/yupachingping200100096/138068580-horror-strzela-do-r%C4%99ki-kobiety-spod-%C5%82%C3%B3%C5%BCka-bia%C5%82ym-tonem.jpg',
  },
  {
    id: 5,
    title: '사진 속 낯선 얼굴',
    description: '친구들과 찍은 사진을 확인하던 중, 누구도 기억하지 못하는 여자의 얼굴이 한가운데 있었다.',
    image: 'https://i.ytimg.com/vi/_BexwGz4Q64/hqdefault.jpg',
  },
  {
    id: 6,
    title: '계속 울리는 전화',
    description: '받자마자 끊어지는 전화가 20분마다 울렸다. 발신자는 5년 전 실종된 내 친구였다.',
    image: 'https://theghostinmymachine.com/wp-content/uploads/2020/09/antiques-4274002_1920-1024x680.jpg',
  },
  {
    id: 7,
    title: '침대 밑의 얼굴',
    description: '침대 밑에서 이상한 냄새가 나 확인했다. 어두운 밑바닥에서 누군가 날 바라보고 있었다.',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpMH3RWLoqijFTbFkonxsyph6ZbkgYVP2tsg&s',
  }
];

function Feed() {
  const [open, setOpen] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [feedList, setFeedList] = useState();
  const [imgList, setImgList] = useState();

  const fnFeedList = () => {
    fetch("http://localhost:3005/pro-feed/list")
      .then(res => res.json())
      .then(data => setFeedList(data.list));
  }

  useEffect(() => {
    fnFeedList();
    
  }, [])

  const handleClickOpen = (feed) => {
    console.log("넘어오냐?",feed.POST_ID);
    fetch("http://localhost:3005/pro-feed/"+feed.POST_ID)
      .then(res => res.json())
      .then(data => {
        setSelectedFeed(data.feed);
        setImgList(data.imgList);
      })
 

    setOpen(true);
    setComments([
      { id: 'user1', text: '멋진 사진이에요!' },
      { id: 'user2', text: '이 장소에 가보고 싶네요!' },
      { id: 'user3', text: '아름다운 풍경이네요!' },
    ]); // 샘플 댓글 추가
    setNewComment(''); // 댓글 입력 초기화
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedFeed(null);
    setComments([]);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([...comments, { id: 'currentUser', text: newComment }]);
      setNewComment('');
    }
  };

  return (
    <Container maxWidth="md" sx={{ bgcolor: '#121212', color: '#f0f0f0', minHeight: '100vh', py: 4 }}>
      <AppBar position="static" sx={{ bgcolor: '#1b1b1b' }}>
        <Toolbar>
          <Typography variant="h5" sx={{ fontFamily: 'Creepster, cursive', letterSpacing: 2 }}>GhostFeed</Typography>
        </Toolbar>
      </AppBar>

      <Box mt={4}>
        {feedList && feedList.map((feed) => (
          <Grid2 xs={12} sm={6} md={4} key={feed.id}>
            <Card key={feed.POST_ID} sx={{ width: 300, bgcolor: '#1e1e1e', color: '#fff' }}>
              <CardMedia
                component="img"
                height="200"
                image={
                  feed.IMG_PATH && feed.IMG_NAME
                    ? "http://localhost:3005/" + feed.IMG_PATH + feed.IMG_NAME
                    : "/no-image.png" // 기본 이미지 경로 (public 폴더 안에 있어야 함) 기본 사진 올리기!!!
                }
                alt={feed.POST_TITLE}
                onClick={() => handleClickOpen(feed)}
                style={{ cursor: 'pointer' }}
              />
              <CardContent>
                <Typography variant="body2" color="textSecondary">
                  {feed.POST_TITLE}
                </Typography>
              </CardContent>
              </Card>
          </Grid2>
        ))}


        <Box display="flex" gap={3} flexWrap="wrap" justifyContent="center">
          {mockFeeds.map((feed) => (
            <Card key={feed.id} sx={{ width: 300, bgcolor: '#1e1e1e', color: '#fff' }}>
              <CardMedia
                component="img"
                height="200"
                image={feed.image}
                alt={feed.title}
                onClick={() => handleClickOpen(feed)}
                sx={{ cursor: 'pointer', filter: 'brightness(70%)', '&:hover': { filter: 'brightness(90%)' } }}
              />
              <CardContent>
                <Typography variant="h6">{feed.title}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
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
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1">{selectedFeed?.POST_CONTENT}</Typography>
            {imgList && (
              <ImageList sx={{ width: 700, height: 500 }} cols={3} rowHeight={164}>
                {imgList.map((item) => (
                  <ImageListItem key={item.img}>
                    <img
                      src={`${"http://localhost:3005/"+item.IMG_PATH+item.IMG_NAME}?w=164&h=164&fit=crop&auto=format`}
                      alt={item.IMG_NAME}
                      loading="lazy"
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            )}
          </Box>

          <Box sx={{ width: '300px', marginLeft: '20px' }}>
            <Typography variant="h6">👻 댓글</Typography>
            <List>
              {comments.map((comment, index) => (
                <ListItem key={index} sx={{ color: '#ddd' }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: '#333' }}>{comment.id.charAt(0).toUpperCase()}</Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={comment.text} secondary={comment.id} />
                </ListItem>
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