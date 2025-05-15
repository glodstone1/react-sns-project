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
import { useNavigate } from 'react-router-dom';


function FeedDetail() {
  const { id } = useParams();
  const token = localStorage.getItem("token");
  const sessionUser = jwtDecode(token);
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [imgList, setImgList] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTarget, setReplyTarget] = useState(null);

  const [like, setLike] = useState(false);       // ✅ true면 추천 누름
  const [likeCount, setLikeCount] = useState(0); // ✅ 추천 수

  const [editModeId, setEditModeId] = useState(null); // 수정 중인 댓글 ID
  const [editContent, setEditContent] = useState(""); // 수정 입력값


  //게시글 및 댓글 호출용
  useEffect(() => {
    console.log("등급", sessionUser.role);
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
        target_id: post.POST_ID,
        owner_email: post.USER_EMAIL // ✅ 게시글 작성자
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

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0'); // 0~11
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${yyyy}년 ${mm}월 ${dd}일 ${hh}시 ${min}분`;
  };

  const handleDeletePost = (postId) => {
    if (!window.confirm("정말 이 게시글을 삭제하시겠습니까?")) return;

    fetch("http://localhost:3005/pro-feed/" + postId, {
      method: "DELETE",
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token") // ✅ 토큰 포함
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("삭제되었습니다.");
          navigate("/feed");
        } else {
          alert("삭제에 실패했습니다.");
        }
      })
      .catch(err => {
        console.error("삭제 오류:", err);
        alert("오류가 발생했습니다.");
      });
  };

  const handleDeleteComment = (commentId) => {
    if (!window.confirm("정말 이 댓글을 삭제하시겠습니까?")) return;

    fetch(`http://localhost:3005/pro-feed/comment/${commentId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        // 댓글 다시 조회
        fetch("http://localhost:3005/pro-feed/" + post.POST_ID)
          .then(res => res.json())
          .then(data => {
            const sorted = data.commList.sort((a, b) => a.COMMENT_ID - b.COMMENT_ID);
            setComments(sorted);
          });
      })
      .catch(err => {
        console.error("댓글 삭제 오류:", err);
        alert("댓글 삭제 중 오류가 발생했습니다.");
      });
  };

  const handleUpdateComment = async (commentId) => {
    try {
      const response = await fetch(`http://localhost:3005/pro-feed/comment/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ content: editContent })
      });

      const data = await response.json();
      if (data.success) {
        // 댓글 목록 갱신
        setComments(prev =>
          prev.map(c =>
            c.COMMENT_ID === commentId ? { ...c, CONTENT: editContent } : c
          )
        );
        setEditModeId(null);
        setEditContent("");
      } else {
        alert("수정 실패");
      }
    } catch (err) {
      console.error("댓글 수정 오류:", err);
    }
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

      <Typography>{formatDateTime(post.CDATE_TIME)}</Typography>

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

        {(sessionUser.email === post.USER_EMAIL || sessionUser.role === 'ADMIN') && (
          <>
            <Button
              variant="outlined"
              size="small"
              color="warning"
              onClick={() => navigate("/edit", { state: post })} // ✅ 클릭 시 수정 페이지로 이동
            >
              수정
            </Button>
            <Button variant="outlined" size="small" color="error" onClick={() => handleDeletePost(post.POST_ID)}>
              삭제
            </Button>
          </>
        )}

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
                      <Avatar src={comment.PROFILE_IMG ? "http://localhost:3005/" + comment.PROFILE_IMG : ""} />
                    </ListItemAvatar>

                    {/* ✅ 이 자리에 조건부 렌더링 적용 */}
                    {editModeId === comment.COMMENT_ID ? (
                      <Box sx={{ flex: 1 }}>
                        <TextField
                          fullWidth
                          size="small"
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                        />
                        <Box mt={1}>
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => handleUpdateComment(comment.COMMENT_ID)}
                            sx={{ mr: 1 }}
                          >
                            저장
                          </Button>
                          <Button
                            size="small"
                            onClick={() => {
                              setEditModeId(null);
                              setEditContent("");
                            }}
                          >
                            취소
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <ListItemText primary={comment.NICK_NAME} secondary={comment.CONTENT} />
                    )}
                  </ListItem>
                  <Typography>{formatDateTime(comment.CDATE_TIME)}</Typography>
                  <Box textAlign="right" px={1}>

                    {(sessionUser.email === comment.USER_EMAIL || sessionUser.role === 'ADMIN') && (
                      <>
                        <Button
                          size="small"
                          onClick={() => {
                            setEditModeId(comment.COMMENT_ID);
                            setEditContent(comment.CONTENT); // 기존 내용 채워 넣기

                          }}
                          sx={{ fontSize: 12, color: '#888' }}
                        >
                          수정
                        </Button>
                        <Button
                          size="small"
                          onClick={() => handleDeleteComment(comment.COMMENT_ID)}
                          sx={{ fontSize: 12, color: '#888' }}
                        >
                          삭제
                        </Button>
                      </>
                    )}
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
                          <Avatar src={reply.PROFILE_IMG ? "http://localhost:3005/" + reply.PROFILE_IMG : ""} />
                        </ListItemAvatar>
                        <ListItemText primary={`↪️ ${reply.NICK_NAME}`} secondary={reply.CONTENT} />
                        {(sessionUser.email === reply.USER_EMAIL || sessionUser.role === 'ADMIN') && (
                          <>
                            <Button
                              size="small"
                              onClick={() => {
                                setEditModeId(comment.COMMENT_ID);
                                setEditContent(comment.CONTENT); // 기존 내용 채워 넣기
                              }}
                              sx={{ fontSize: 12, color: '#888' }}
                            >
                              수정
                            </Button>
                            <Button
                              size="small"
                              onClick={() => handleDeleteComment(reply.COMMENT_ID)}
                              sx={{ fontSize: 12, color: '#888' }}
                            >
                              삭제
                            </Button>
                          </>
                        )}
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