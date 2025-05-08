import React from 'react';
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
import { useState } from 'react';
import { jwtDecode } from 'jwt-decode'; // 토큰 디코딩
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [file, setFile] = useState(null);
  let titleRef = useRef();
  let contentRef = useRef();
  const token = localStorage.getItem("token"); // 로컬 스토리지에서 토큰 꺼내기
  const navigate = useNavigate();
  const [fearType, setFearType] = useState("");
  const sessionUser = jwtDecode(token);


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
        navigate("/feed"); // 원하는 경로
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
          👻 등록하기
        </Typography>

        <FormControl fullWidth margin="normal">
          <InputLabel sx={{ color: '#fff' }}>카테고리</InputLabel>
          <Select value={fearType} // 선택된 값 반영
            onChange={(e) => setFearType(e.target.value)}
            label="카테고리"
            sx={{ color: '#fff', borderColor: '#fff' }}>
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
              sx={{ width: 56, height: 56, marginLeft: 1 ,borderRadius: 0}}
            />
          ))}

          <Typography variant="body1" sx={{ marginLeft: 2, color: '#ccc' }}>
            {file ? file.name : '첨부할 파일 선택'}
          </Typography>
        </Box>

        <Button
          onClick={fnRegister}
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
          등록하기
        </Button>
      </Box>
    </Container>
  );
}

export default Register;