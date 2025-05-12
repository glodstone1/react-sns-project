import React, { useEffect, useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Avatar,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  IconButton
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function FeedDetail() {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const sessionUser = jwtDecode(token);

  const [post, setPost] = useState(null);
  const [imgList, setImgList] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTarget, setReplyTarget] = useState(null);

  const [like, setLike] = useState(false);       // ✅ true면 추천 누름
  const [likeCount, setLikeCount] = useState(0); // ✅ 추천 수


  //게시글 및 댓글 호출용
  useEffect(() => {
    fetch("http://localhost:3005/pro-feed/" + id)
      .then(res => res.json())
      .then(data => {
        setPost(data.feed);
        setImgList(data.imgList);
        const sorted = data.commList.sort((a, b) => a.COMMENT_ID - b.COMMENT_ID);
        setComments(sorted);
      });
  }, [id]);

  //좋아요 추천 수 호출용
  useEffect(() => {
    if (!post) return;
    fetch(`http://localhost:3005/pro-like/status?email=${sessionUser.email}&type=POST&id=${post.POST_ID}`)
      .then(res => res.json())
      .then(data => {
        setLike(data.liked);       // 내가 추천했는지
        setLikeCount(data.count);  // 전체 추천 수
      });
  }, [post]);

  const handleAddComment = (postId, parentId = null) => {
    if (!newComment.trim()) {
      alert("댓글을 입력해주세요.");
      return;
    }

    fetch("http://localhost:3005/pro-feed/comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
        // 댓글 다시 조회
        fetch("http://localhost:3005/pro-feed/" + postId)
          .then(res => res.json())
          .then(data => {
            const sorted = data.commList.sort((a, b) => a.COMMENT_ID - b.COMMENT_ID);
            setComments(sorted);
          });
      });
  };

  const handleLikeClick = () => {
    fetch("http://localhost:3005/pro-like/toggle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: sessionUser.email,
        content_type: "POST",
        target_id: post.POST_ID
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.result === "liked") {
          setLike(true);
          setLikeCount(prev => prev + 1);
        } else if (data.result === "unliked") {
          setLike(false);
          setLikeCount(prev => prev - 1);
        }
      });
  };

  if (!post) return <Typography sx={{ color: '#fff' }}>로딩 중...</Typography>;

  return (
    <Container maxWidth="md" sx={{ py: 4, color: '#fff', backgroundColor: '#111', minHeight: '100vh', backdropFilter: 'blur(4px)' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff1744', mb: 2 }}>
        {post.POST_TITLE}
      </Typography>

      <Typography variant="body1" sx={{ whiteSpace: 'pre-line', mb: 2 }}>
        {post.POST_CONTENT}
      </Typography>

      {imgList && imgList.map((item, idx) => (
        <Box key={idx} mb={2}>
          <img src={`http://localhost:3005/${item.IMG_PATH}${item.IMG_NAME}`} alt="" style={{ width: '100%' }} />
        </Box>
      ))}

      <Box display="flex" justifyContent="center" mt={3}>
        <Box
          onClick={handleLikeClick}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: 100,
            height: 80,
            backgroundColor: '#1e1e1e',
            borderRadius: 2,
            border: '1px solid #333',
            cursor: 'pointer',
            transition: '0.3s',
            '&:hover': {
              backgroundColor: '#2a2a2a',
              borderColor: '#ff1744'
            }
          }}
        >
          <Typography sx={{ fontSize: '2rem', color: like ? '#ff1744' : '#888' }}>
            {like ? '☠️' : '🔺'}
          </Typography>
          <Typography sx={{ color: '#ccc', fontWeight: 'bold', fontSize: '1rem' }}>
            추천 {likeCount}
          </Typography>
        </Box>
      </Box>

      <Box mt={4}>
        <Typography variant="h6">👻 댓글</Typography>
        <List>
          {comments.map(comment => (
            <Box key={comment.COMMENT_ID}>
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

                  <Box textAlign="right" px={1}>
                    <Button
                      size="small"
                      onClick={() => setReplyTarget(replyTarget === comment.COMMENT_ID ? null : comment.COMMENT_ID)}
                      sx={{ fontSize: 12, color: '#888' }}
                    >
                      답글
                    </Button>
                  </Box>

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
                        onClick={() => handleAddComment(post.POST_ID, comment.COMMENT_ID)}
                        sx={{ mt: 1 }}
                      >
                        답글 달기
                      </Button>
                    </Box>
                  )}

                  <Divider sx={{ borderColor: '#444' }} />
                </>
              )}
            </Box>
          ))}
        </List>

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
              onClick={() => handleAddComment(post.POST_ID)}
              sx={{ mt: 1 }}
            >
              댓글 추가
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default FeedDetail;