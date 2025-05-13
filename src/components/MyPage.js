import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Avatar, Paper, Grid, Dialog, DialogTitle, DialogContent, Button, DialogActions } from '@mui/material';
import { jwtDecode } from 'jwt-decode';

function MyPage() {
  const { email } = useParams(); // ✅ URL 파라미터에서 email 추출
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const sessionUser = token ? jwtDecode(token) : null; // ✅ 로그인된 사용자 정보

  const [info, setInfo] = useState({});
  const [isMe, setIsMe] = useState(false); // ✅ 본인 여부 판단
  const [open, setOpen] = useState(false);
  const [imgUrl, setImgUrl] = useState();
  const [insertFile, setFile] = useState();

  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [myPosts, setMyPosts] = useState([]);

  const fnUserInfo = () => {
    fetch("http://localhost:3005/pro-user/" + email)
      .then(res => res.json())
      .then(data => {
         console.log("유저 정보 응답 확인:", data); // ✅ 여기 추가
        setInfo(data.info);
        setIsMe(sessionUser?.email === email); // ✅ 로그인한 사용자와 일치 여부 확인
      });
  };

  const selectImg = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      setImgUrl(imgUrl);
      setFile(file);
    }
  };

  const fnSaveImg = () => {
    const formData = new FormData();
    formData.append("file", insertFile);
    formData.append("email", info.USER_EMAIL);
    fetch("http://localhost:3005/pro-user/upload", {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        alert("저장되었습니다.");
        setOpen(false);
        fnUserInfo();
      });
  };

  const MyPageStat = () => {
    fetch("http://localhost:3005/pro-user/mypage-stat?email=" + email)
      .then(res => res.json())
      .then(data => {
        setFollowerCount(data.follower_count);
        setFollowingCount(data.following_count);
        setPostCount(data.post_count);
      });
  };

  const fetchMyPosts = () => {
    fetch("http://localhost:3005/pro-user/posts?email=" + email)
      .then(res => res.json())
      .then(data => {
        setMyPosts(data.posts);
      });
  };

  const handleDeletePost = (postId) => {
    if (!window.confirm("정말 이 게시글을 삭제하시겠습니까?")) return;

    fetch("http://localhost:3005/pro-feed/" + postId, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("삭제되었습니다.");
          fetchMyPosts();
          MyPageStat();
        } else {
          alert("삭제에 실패했습니다.");
        }
      });
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const min = String(date.getMinutes()).padStart(2, '0');
    return `${yyyy}년 ${mm}월 ${dd}일 ${hh}시 ${min}분`;
  };

  useEffect(() => {
    if (!token) {
      alert("이야기를 보고싶다면 가입하세요.");
      navigate("/prologin");
    } else {
      fnUserInfo();
      MyPageStat();
      fetchMyPosts();
      
    }
  }, [email]);

  return (
    <Container maxWidth="md" sx={{ backgroundColor: 'rgba(0,0,0,0.6)', minHeight: '130vh', color: '#fff', paddingTop: '20px', borderRadius: 3 }}>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Paper sx={{ backgroundColor: 'rgba(0,0,0,0.6)', padding: '30px', borderRadius: '15px', width: '100%', color: '#fff', boxShadow: '0 0 10px rgba(255, 0, 0, 0.3)', marginBottom: 2 }}>
          <Box display="flex" flexDirection="column" alignItems="center" sx={{ marginBottom: 3 }}>
            <Avatar
              alt="프로필 이미지"
              src={info?.PROFILE_IMG ? "http://localhost:3005/" + info.PROFILE_IMG : ""}
              sx={{ width: 120, height: 120, marginBottom: 2, border: '2px solid #ff1744', cursor: isMe ? 'pointer' : 'default' }}
              onClick={() => isMe && setOpen(!open)}
            />
            <Typography variant="h4" sx={{ fontFamily: 'Creepster, cursive', color: '#fff' }}>{info?.NICK_NAME}</Typography>
            <Typography variant="body2" sx={{ color: '#ccc' }}>{info?.USER_EMAIL}</Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={4} textAlign="center">
              <Typography variant="h6">👁️ 추종자</Typography>
              <Typography variant="body1">{followerCount}</Typography>
            </Grid>
            <Grid item xs={4} textAlign="center">
              <Typography variant="h6">🕯️ 동행자</Typography>
              <Typography variant="body1">{followingCount}</Typography>
            </Grid>
            <Grid item xs={4} textAlign="center">
              <Typography variant="h6">📜 기록</Typography>
              <Typography variant="body1">{postCount}</Typography>
            </Grid>
          </Grid>

          <Box sx={{ marginTop: 4 }}>
            <Typography variant="h6" sx={{ color: '#ff1744' }}>저주받은 소개</Typography>
            <Typography>{info?.INTRO}</Typography>
          </Box>
        </Paper>

        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>이미지 수정</DialogTitle>
          <DialogContent>
            <label>
              <input onChange={selectImg} type="file" accept="image/*" style={{ display: "none" }} />
              <Button variant='outlined' component="span">이미지 선택</Button>
              {!imgUrl ? " 선택된 파일 없음 " : "이미지 선택 됨"}
            </label>
          </DialogContent>
          {imgUrl && (
            <Box mt={2} textAlign="center">
              <Typography variant='h6'>미리보기</Typography>
              <Avatar src={imgUrl} sx={{ width: 100, height: 100, margin: '10px auto' }} />
            </Box>
          )}
          <DialogActions>
            <Button variant='contained' onClick={fnSaveImg}>저장</Button>
            <Button variant='outlined' onClick={() => { setOpen(false); setImgUrl(null); }}>취소</Button>
          </DialogActions>
        </Dialog>

        <Box sx={{ width: '100%' }}>
          <Typography variant="h6" sx={{ color: '#ff1744' }}>🧾 나의 기록</Typography>
          {myPosts.length === 0 ? (
            <Typography>작성한 게시글이 없습니다.</Typography>
          ) : (
            myPosts.map(post => (
              <Box key={post.POST_ID} onClick={() => navigate("/post/" + post.POST_ID)} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 2, backgroundColor: '#222', borderRadius: 2, marginTop: 2, cursor: 'pointer', '&:hover': { backgroundColor: '#333' } }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {post.IMG_NAME && (
                    <img
                      src={`http://localhost:3005/${post.IMG_PATH}${post.IMG_NAME}`}
                      alt="썸네일"
                      style={{ width: 120, height: 120, objectFit: 'cover', marginRight: 20, borderRadius: 6 }}
                    />
                  )}
                  <Box>
                    <Typography variant="h6">{post.POST_TITLE}</Typography>
                    <Typography variant="caption" sx={{ color: '#999' }}>{formatDateTime(post.CDATE_TIME)}</Typography>
                  </Box>
                </Box>
                {isMe && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }} onClick={(e) => e.stopPropagation()}>
                    <Button variant="outlined" size="small" color="warning" onClick={() => navigate("/edit", { state: post })}>✏️ 수정</Button>
                    <Button variant="outlined" size="small" color="error" onClick={() => handleDeletePost(post.POST_ID)}>🗑️ 삭제</Button>
                  </Box>
                )}
              </Box>
            ))
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default MyPage;
