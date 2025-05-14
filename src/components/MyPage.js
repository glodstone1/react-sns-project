import React, { useState, useEffect, useRef } from 'react';
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

  const [isFollowing, setIsFollowing] = useState(false); // 팔로우 여부
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false); // 다이얼로그 열기
  const postRef = useRef(null); // 나의 기록 위치

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

  const handleFollow = () => {
    fetch("http://localhost:3005/pro-follow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({
        follower: sessionUser.email, // 로그인한 유저 (팔로우 요청하는 쪽)
        following: email            // 현재 보고 있는 유저 (팔로우 당하는 쪽)
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("동행자 요청을 보냈습니다.");
          setIsFollowing(true);
          MyPageStat(); // 팔로잉 수 업데이트
        } else {
          alert("요청 실패: " + data.message);
        }
      });
  };

  const checkFollowStatus = () => {
    fetch(`http://localhost:3005/pro-follow/status?follower=${sessionUser.email}&following=${email}`)
      .then(res => res.json())
      .then(data => {
        setIsFollowing(data.isFollowing); // true / false 리턴
        console.log("팔로윙 체크", data.isFollowing);
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

  const handleUnfollow = () => {
    fetch("http://localhost:3005/pro-follow", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token
      },
      body: JSON.stringify({
        follower: sessionUser.email,
        following: email
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          alert("동행을 포기했습니다...");
          setIsFollowing(false);
          setCancelDialogOpen(false);
          MyPageStat();
        } else {
          alert("실패: " + data.message);
        }
      });
  };

  useEffect(() => {
    if (!token) {
      alert("이야기를 보고싶다면 가입하세요.");
      navigate("/prologin");
    } else {
      fnUserInfo();
      MyPageStat();
      fetchMyPosts();
      if (sessionUser?.email !== email) {
        checkFollowStatus();
      }
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
            {!isMe && (
              isFollowing ? (
                <>
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => setCancelDialogOpen(true)}
                    sx={{ mt: 2 }}
                  >
                    💔 동행 중
                  </Button>

                  <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
                    <DialogTitle>동행을 포기하겠습니까?</DialogTitle>
                    <DialogActions>
                      <Button onClick={() => setCancelDialogOpen(false)}>아니오</Button>
                      <Button onClick={handleUnfollow} color="error">예</Button>
                    </DialogActions>
                  </Dialog>
                </>
              ) : (
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleFollow}
                  sx={{ mt: 2 }}
                >
                  🎃 동행자 요청
                </Button>
              )
            )}
          </Box>

          <Grid container spacing={2}>
            <Grid
              item xs={4}
              onClick={() => navigate(`/myfollowerslist/${encodeURIComponent(info?.USER_EMAIL)}`)}
              sx={{ textAlign: "center", cursor: "pointer" }}
            >
              <Typography variant="h6">👁️ 추종자</Typography>
              <Typography variant="body1">{followerCount}</Typography>
            </Grid>
            <Grid
              item xs={4}
              onClick={() => navigate(`/myfollowinglist/${encodeURIComponent(info?.USER_EMAIL)}`)}
              sx={{ textAlign: "center", cursor: "pointer" }}  // ✅ 여기에 cursor 포함
            >
              <Typography variant="h6">🕯️ 동행자</Typography>
              <Typography variant="body1">{followingCount}</Typography>
            </Grid>
            <Grid
              item xs={4}
              onClick={() => postRef.current?.scrollIntoView({ behavior: 'smooth' })}
              sx={{ textAlign: "center", cursor: "pointer" }}
            >
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
          <Typography
            variant="h6"
            sx={{ color: '#ff1744' }}
            ref={postRef} // 📌 여기에 ref 연결
          >
            🧾 {info?.NICK_NAME}의 기록
          </Typography>
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
