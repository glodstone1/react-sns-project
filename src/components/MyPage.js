import React from 'react';
import { Container, Box, Typography, Avatar, Paper, Grid, Dialog, DialogTitle, DialogContent, Button, DialogActions } from '@mui/material';
import { jwtDecode } from 'jwt-decode'; // 토큰 디코딩
import { useState, useEffect, } from 'react';
import { useNavigate } from 'react-router-dom';

function MyPage() {

  let [info, setInfo] = useState({});
  let [open, setOpen] = useState(false); // 프로필 사진 오픈용 선언
  let [imgUrl, setImgUrl] = useState();
  let [insertFile, setFile] = useState();

  let [followerCount, setFollowerCount] = useState(0);
  let [followingCount, setFollowingCount] = useState(0);
  let [postCount, setPostCount] = useState(0);
  const [myPosts, setMyPosts] = useState([]);


  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // 로컬 스토리지에서 토큰 꺼내기
  const fnUserInfo = () => {
    const sessionUser = jwtDecode(token); // 오류 걸리지 않기 위해 밑으로 빼줌
    fetch("http://localhost:3005/pro-user/" + sessionUser.email)
      .then(res => res.json())
      .then(data => {
        setInfo(data.info);
      });
  }

  const selectImg = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgUrl = URL.createObjectURL(file); // 여기다 넣으면 이미지 URL을 얻을 수 있다
      setImgUrl(imgUrl);
      setFile(file);
    }
  }

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
        console.log(data);
        alert("저장되었습니다.");
        setOpen(false);
        fnUserInfo();
      })
      .catch(err => {
        console.error(err);
      });
  }

  const MyPageStat = () => {
    const sessionUser = jwtDecode(token);
    fetch("http://localhost:3005/pro-user/mypage-stat?email=" + sessionUser.email)
      .then(res => res.json())
      .then(data => {
        setFollowerCount(data.follower_count);
        setFollowingCount(data.following_count);
        setPostCount(data.post_count);
        console.log("마이페이지 통계", data);
      });
  };

  const fetchMyPosts = () => {
    const sessionUser = jwtDecode(token);
    fetch("http://localhost:3005/pro-user/posts?email=" + sessionUser.email)
      .then(res => res.json())
      .then(data => {
        setMyPosts(data.posts);
      })
      .catch(err => {
        console.error("게시글 목록 에러", err.message);
      });
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
          fetchMyPosts(); // 목록 새로고침
          MyPageStat();   // 게시글 수 갱신
        } else {
          alert("삭제에 실패했습니다.");
        }
      })
      .catch(err => {
        console.error("삭제 오류:", err);
        alert("오류가 발생했습니다.");
      });
  };


  useEffect(() => {
    if (!token) {
      alert("이야기를 보고싶다면 가입하세요.")
      navigate("/prologin");
    } else {
      fnUserInfo();
      MyPageStat();
      fetchMyPosts(); // ✅ 게시글 목록도 불러오기
    }
  }, [])

  return (
    <Container maxWidth="md"
      sx={{
        backgroundColor: 'rgba(0,0,0,0.6)',
        minHeight: '130vh',
        color: '#fff',
        paddingTop: '20px',
        height: 'auto',
        borderRadius: 3,
        backdropFilter: 'blur(1px)',
      }}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="flex-start"
        minHeight="50vh"

      >
        <Paper
          sx={{
            backgroundColor: 'rgba(0,0,0,0.6)',
            padding: '30px',
            borderRadius: '15px',
            width: '100%',
            color: '#fff',
            boxShadow: '0 0 10px rgba(255, 0, 0, 0.3)',
            backdropFilter: 'blur(5px)',
            marginBottom: 2 // ✅ 게시글 목록과 너무 떨어져서 간격 붙이기 위해 margin 추가
          }}
        >
          {/* 프로필 */}
          <Box display="flex" flexDirection="column" alignItems="center" sx={{ marginBottom: 3 }}>
            <Avatar
              alt="프로필 이미지"
              src={info.PROFILE_IMG ? "http://localhost:3005/" + info.PROFILE_IMG : ""} // 프로필 이미지 경로
              sx={{ width: 120, height: 120, marginBottom: 2, border: '2px solid #ff1744', cursor: 'pointer' }}
              onClick={() => { setOpen(!open) }}
            />
            <Typography variant="h4" sx={{ fontFamily: 'Creepster, cursive', color: '#fff' }}>{info.NICK_NAME}</Typography>
            <Typography variant="body2" sx={{ color: '#ccc' }}>{info.USER_EMAIL}</Typography>
          </Box>

          {/* 통계 */}
          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item xs={4} textAlign="center">
              <Typography variant="h6" sx={{ color: '#fff' }}>👁️ 추종자</Typography>
              <Typography variant="body1" sx={{ color: '#fff', cursor: 'pointer' }}>
                {followerCount}
              </Typography>
            </Grid>
            <Grid item xs={4} textAlign="center">
              <Typography variant="h6" sx={{ color: '#fff' }}>🕯️ 동행자</Typography>
              <Typography variant="body1" sx={{ color: '#fff', cursor: 'pointer' }}>
                {followingCount}
              </Typography>
            </Grid>
            <Grid item xs={4} textAlign="center">
              <Typography variant="h6" sx={{ color: '#fff' }}>📜 기록</Typography>
              <Typography variant="body1" sx={{ color: '#fff', cursor: 'pointer' }}>
                {postCount}
              </Typography>
            </Grid>
          </Grid>

          {/* 소개글 */}
          <Box sx={{ marginTop: 4 }}>
            <Typography variant="h6" sx={{ color: '#ff1744' }}>저주받은 소개</Typography>
            <Typography variant="body1" sx={{ color: '#fff' }}>
              {info.INTRO}
            </Typography>
          </Box>

          {/* 무서운 이야기 */}
          {/* <Box sx={{ marginTop: 4 }}>
            <Typography variant="h6" sx={{ color: '#ff1744' }}>🔮 나의 이야기</Typography>
            <Typography variant="body2" sx={{ color: '#fff' }}>
              한밤중, 아무도 없는 폐가에서 들렸던 낮은 웃음소리...
              그 이후 나는 무언가에게 계속 쫓기고 있어요.
            </Typography>
          </Box> */}

          {/* 불길한 문구 */}
          <Box sx={{ marginTop: 5, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: '#888' }}>
              당신을 지켜보는 이가 있습니다...
            </Typography>
          </Box>
        </Paper>
        <Dialog open={open}>
          <DialogTitle>이미지 수정</DialogTitle>
          <DialogContent>
            <label>
              <input onChange={selectImg} type="file" accept="image/*" style={{ display: "none" }}></input>
              <Button variant='outlined' component="span">이미지 선택</Button>
              {!imgUrl ? " 선택된 파일 없음 " : "이미지 선택 됨"}
              {/* component를 html(span)으로 인식시켜야 파일 첨구 창이 열림 */}
            </label>
          </DialogContent>
          {imgUrl && (
            <Box mt={2}>
              {/* mt =marginTop */}
              <Typography variant='h5'>미리보기</Typography>
              <Avatar
                alt="프로필 이미지"
                src={imgUrl} // 프로필 이미지 경로
                sx={{ width: 100, height: 100, marginTop: 2 }}
                onClick={() => { setOpen(!open) }}
              />
            </Box>
          )}
          <DialogActions>
            <Button variant='contained' onClick={fnSaveImg}>저장</Button>
            <Button variant='outlined' onClick={() => {
              setOpen(false);
              setImgUrl(null);
            }}>취소</Button>
          </DialogActions>
        </Dialog>
      </Box>

      <Box sx={{ marginTop: 0 }}>
        <Typography variant="h6" sx={{ color: '#ff1744' }}>🧾 나의 기록</Typography>
        {myPosts.length === 0 ? (
          <Typography variant="body2" sx={{ color: '#ccc' }}>작성한 게시글이 없습니다.</Typography>
        ) : (
          myPosts.map(post => (
            <Box
              key={post.POST_ID}
              onClick={() => navigate("/post/" + post.POST_ID)}
              sx={{
                display: 'flex',
                justifyContent: 'space-between', // ✅ 좌우로 분리
                alignItems: 'center',
                marginTop: 2,
                padding: 2,
                backgroundColor: '#222',
                borderRadius: 2,
                cursor: 'pointer',
                '&:hover': { backgroundColor: '#333' }
              }}
            >
              {/* 왼쪽: 썸네일 + 제목 */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {post.IMG_NAME && (
                  <img
                    src={`http://localhost:3005/${post.IMG_PATH}${post.IMG_NAME}`}
                    alt="썸네일"
                    style={{
                      width: 120,
                      height: 120,
                      objectFit: 'cover',
                      marginRight: 20,
                      borderRadius: 6
                    }}
                  />
                )}
                <Box>
                  <Typography variant="h6" sx={{ color: '#fff' }}>{post.POST_TITLE}</Typography>
                  <Typography variant="caption" sx={{ color: '#999' }}>{post.CDATE_TIME}</Typography>
                </Box>
              </Box>

              {/* 오른쪽: 수정/삭제 버튼 (기능 없음) */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1
                }}
                onClick={(e) => e.stopPropagation()} // ✅ 클릭 시 post 상세 이동 막음
              >
                <Button
                  variant="outlined"
                  size="small"
                  color="warning"
                  onClick={() => navigate("/edit", { state: post })} // ✅ 클릭 시 수정 페이지로 이동
                >
                  ✏️ 수정
                </Button>
                <Button variant="outlined" size="small" color="error" onClick={() => handleDeletePost(post.POST_ID)}>
                  🗑️ 삭제
                </Button>
              </Box>
            </Box>
          ))
        )}
      </Box>
    </Container>
  );
}

export default MyPage;