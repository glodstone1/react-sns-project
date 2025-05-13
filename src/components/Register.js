import React, { useState, useEffect, useRef } from 'react';
import {
  TextField, Button, Container, Typography, Box,
  InputLabel, FormControl, Select, MenuItem,
  Avatar, IconButton
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { jwtDecode } from 'jwt-decode';
import { useNavigate, useLocation } from 'react-router-dom';

function Register() {
  const [file, setFile] = useState(null);
  const [existingImages, setExistingImages] = useState([]); // ✅ 기존 이미지 목록
  const [imagesToDelete, setImagesToDelete] = useState([]); // 삭제 예정 이미지 ID
  let titleRef = useRef();
  let contentRef = useRef();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [fearType, setFearType] = useState("");
  const sessionUser = jwtDecode(token);
  const location = useLocation();
  const postData = location.state;
  const editMode = !!postData;


  useEffect(() => {
    if (editMode && postData) {
      titleRef.current.value = postData.POST_TITLE;
      contentRef.current.value = postData.POST_CONTENT;
      setFearType(postData.POST_TYPE || "");
      // ✅ 기존 이미지 불러오기
      fetch(`http://localhost:3005/pro-feed/${postData.POST_ID}/images`)
        .then(res => res.json())
        .then(data => setExistingImages(data.images || []));
    }
  }, [editMode, postData]);


  const handleFileChange = (event) => {
    setFile(event.target.files);
  };

  const fnUploadFile = (feedId) => {
    const formData = new FormData();
    for (let i = 0; i < file.length; i++) {
      formData.append("file", file[i]);
    }
    formData.append("feedId", feedId);
    fetch("http://localhost:3005/pro-feed/upload", {
      method: "POST",
      body: formData
    })
      .then(res => res.json())
      .then(data => {
        alert(editMode ? "수정되었습니다." : "등록되었습니다.");
        navigate("/feed");
      })
      .catch(err => console.error(err));
  };

  const handleReserveDeleteImage = (imgId) => {
    const confirm = window.confirm("정말 이 이미지를 삭제하시겠습니까?");
    if (confirm) {
      setImagesToDelete(prev => [...prev, imgId]);
      setExistingImages(prev => prev.filter(img => img.POST_IMG_ID !== imgId));
    }
  };

  const fnRegister = () => {
    if (!titleRef.current.value || !contentRef.current.value) return alert("모든 항목을 입력해주세요.");
    if (!fearType) return alert("카테고리를 선택해주세요.");
    fetch("http://localhost:3005/pro-feed", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        email: sessionUser.email,
        title: titleRef.current.value,
        content: contentRef.current.value,
        type: fearType
      })
    })
      .then(res => res.json())
      .then(data => {
        if (file) {
          fnUploadFile(data.result.insertId);
        } else {
          alert("등록되었습니다.");
          navigate("/feed");
        }
      });
  };

  const fnUpdate = () => {
    if (!titleRef.current.value || !contentRef.current.value) return alert("모든 항목을 입력해주세요.");
    if (!postData) return;

    // 1단계: 글 수정
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
      .then(async () => {
        // 2단계: 이미지 삭제
        for (let imgId of imagesToDelete) {
          await fetch(`http://localhost:3005/pro-feed/image/${imgId}`, {
            method: "DELETE"
          });
        }

        // 3단계: 새 이미지 업로드
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
          {editMode ? "👻 수정하기" : "👻 등록하기"}
        </Typography>

        <FormControl fullWidth margin="normal">
          <InputLabel sx={{ color: '#fff' }}>카테고리</InputLabel>
          <Select
            value={fearType || ""}
            onChange={(e) => setFearType(e.target.value)}
            label="카테고리"
            sx={{ color: '#fff', borderColor: '#fff' }}
          >
            <MenuItem value="real">실화 / 체험담</MenuItem>
            <MenuItem value="watch">목격담 / 제보</MenuItem>
            <MenuItem value="dream">꿈 / 예지몽</MenuItem>
            <MenuItem value="mystery">불가사의 / 미지</MenuItem>
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

        {/* ✅ 기존 이미지 미리보기 */}
        <Box display="flex" gap={2} flexWrap="wrap" my={2}>
          {existingImages.map(img => (
            <Box key={img.POST_IMG_ID} sx={{ position: 'relative' }}>
              <Avatar
                src={`http://localhost:3005/${img.IMG_PATH}${img.IMG_NAME}`}
                variant="rounded"
                sx={{ width: 80, height: 80, borderRadius: 1 }}
              />
              <IconButton
                size="small"
                onClick={() => handleReserveDeleteImage(img.POST_IMG_ID)}
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  '&:hover': { backgroundColor: 'red' }
                }}
              >
                ✕
              </IconButton>
            </Box>
          ))}
        </Box>

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
              src={URL.createObjectURL(f)}
              alt={`첨부된 이미지 ${idx + 1}`}
              sx={{ width: 56, height: 56, marginLeft: 1, borderRadius: 0 }}
            />
          ))}
          <Typography variant="body1" sx={{ marginLeft: 2, color: '#ccc' }}>
            {file ? file.name : '첨부할 파일 선택'}
          </Typography>
        </Box>

        <Button
          onClick={editMode ? fnUpdate : fnRegister}
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