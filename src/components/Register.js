import React, { useState, useEffect, useRef, } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  InputLabel,
  FormControl,
  Select,
  MenuItem,
  Avatar,
  IconButton,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { jwtDecode } from 'jwt-decode'; // 토큰 디코딩
import { useNavigate, useParams, useLocation } from 'react-router-dom'; // ✅ useParams, useLocation 추가

function Register() { // ✅ editMode와 postData prop 추가
  const [file, setFile] = useState(null);
  let titleRef = useRef();
  let contentRef = useRef();
  const token = localStorage.getItem("token"); // 로컬 스토리지에서 토큰 꺼내기
  const navigate = useNavigate();
  const [fearType, setFearType] = useState("");
  const sessionUser = jwtDecode(token);
  const location = useLocation();
  const postData = location.state;
  const editMode = !!postData; // postData가 있으면 수정 모드

  // ✅ 수정 모드일 경우 초기값 세팅
  useEffect(() => {
    console.log("postData.POST_TYPE:", postData?.POST_Id); // 여기 확인
    if (editMode && postData) {
      titleRef.current.value = postData.POST_TITLE;
      contentRef.current.value = postData.POST_CONTENT;
      setFearType(postData.POST_TYPE || ""); // 'real', 'dream', 'watch', 'mystery' 중 하나
    }
  }, [editMode, postData]);

  const handleFileChange = (event) => {
    setFile(event.target.files);
  };

  const fnUploadFile = (feedId) => {
    const formData = new FormData();
    for (let i = 0; i < file.length; i++) {
      formData.append("file", file[i]); //file=object1&file=object2&file=object...
    }
    formData.append("feedId", feedId);
    fetch("http://localhost:3005/pro-feed/upload", {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        alert(editMode ? "수정되었습니다." : "등록되었습니다.");
        navigate("/feed");
      })
      .catch(err => {
        console.error(err);
      });
  };

  const fnRegister = () => {
    if (!titleRef.current.value || !contentRef.current.value) return alert("모든 항목을 입력해주세요.");
    if (fearType == "" || fearType == null) return alert("카테고리를 선택해주세요.");
    fetch("http://localhost:3005/pro-feed", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body:
        JSON.stringify({
          email: sessionUser.email,
          title: titleRef.current.value,
          content: contentRef.current.value,
          type: fearType
        })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if (file) {
          fnUploadFile(data.result.insertId);
        } else {
          alert("등록되었습니다.");
          navigate("/feed"); // 원하는 경로
        }
      });
  };

  const fnUpdate = () => { // ✅ 수정 함수 추가
    if (!titleRef.current.value || !contentRef.current.value) return alert("모든 항목을 입력해주세요.");
    if (!postData) return;

    fetch("http://localhost:3005/pro-feed/" + postData.POST_ID, {
      method: "PUT",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        title: titleRef.current.value,
        content: contentRef.current.value,
        type: fearType
      })
    })
      .then(res => res.json())
      .then(data => {
        if (file) {
          fnUploadFile(postData.POST_ID);
        } else {
          alert("수정되었습니다.");
          navigate("/post/" + postData.POST_ID);
        }
      });
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="flex-start"
        minHeight="100vh"
        sx={{
          padding: '20px',
          backgroundColor: 'rgba(0,0,0,0.6)',
          borderRadius: 3,
          color: '#fff',
          boxShadow: '0 0 10px rgba(255, 0, 0, 0.3)',
          backdropFilter: 'blur(5px)'
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontFamily: 'Creepster, cursive', color: '#ff1744' }}
        >
          {editMode ? "👻 수정하기" : "👻 등록하기"} {/* ✅ 제목 분기 */}
        </Typography>

        <FormControl fullWidth margin="normal">
          <InputLabel sx={{ color: '#fff' }}>카테고리</InputLabel>
          <Select
            value={fearType || ""} // ⚠️ 항상 controlled 상태 유지
            onChange={(e) => setFearType(e.target.value)}
            label="카테고리"
            sx={{ color: '#fff', borderColor: '#fff' }}
          >
            <MenuItem value={"real"}>실화 / 체험담</MenuItem>
            <MenuItem value={"watch"}>목격담 / 제보</MenuItem>
            <MenuItem value={"dream"}>꿈 / 예지몽</MenuItem>
            <MenuItem value={"mystery"}>불가사의 / 미지</MenuItem>
          </Select>
        </FormControl>

        <TextField
          inputRef={titleRef}
          label="제목"
          variant="outlined"
          margin="normal"
          fullWidth
          sx={{ input: { color: '#fff' }, label: { color: '#fff' } }}
        />

        <TextField
          inputRef={contentRef}
          label="내용"
          variant="outlined"
          margin="normal"
          fullWidth
          multiline
          rows={4}
          sx={{ textarea: { color: '#fff' }, label: { color: '#fff' } }}
        />

        <Box display="flex" alignItems="center" width="100%" mt={2}>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            multiple
          />
          <label htmlFor="file-upload">
            <IconButton color="error" component="span">
              <PhotoCamera />
            </IconButton>
          </label>

          {file && [...file].map((f, idx) => (
            <Avatar
              key={idx}
              alt={`첨부된 이미지 ${idx + 1}`}
              src={URL.createObjectURL(f)}
              sx={{ width: 56, height: 56, marginLeft: 1, borderRadius: 0 }}
            />
          ))}

          <Typography variant="body1" sx={{ marginLeft: 2, color: '#ccc' }}>
            {file ? file.name : '첨부할 파일 선택'}
          </Typography>
        </Box>

        <Button
          onClick={editMode ? fnUpdate : fnRegister} // ✅ 등록/수정 분기
          variant="contained"
          color="error"
          fullWidth
          sx={{
            marginTop: '20px',
            fontWeight: 'bold',
            backgroundColor: '#d50000',
            '&:hover': {
              backgroundColor: '#ff1744'
            }
          }}
        >
          {editMode ? "수정하기" : "등록하기"}
        </Button>
      </Box>
    </Container>
  );
}

export default Register;
