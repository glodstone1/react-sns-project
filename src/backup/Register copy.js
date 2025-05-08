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

function Register() {
  const [file, setFile] = useState(null);
  let titleRef = useRef();
  let contentRef = useRef();
  const token = localStorage.getItem("token"); // 로컬 스토리지에서 토큰 꺼내기
  // const [title, setTitle] = useState("");
  // const [content, setContent] = useState("");
  const sessionUser = jwtDecode(token)

  const handleFileChange = (event) => {
    setFile(event.target.files);
  };


  const fnUploadFile = (feedId)=>{
    const formData = new FormData();
    for(let i=0; i<file.length; i++){
        formData.append("file", file[i]); //file=object1&file=object2&file=object...
    }
    formData.append("feedId", feedId);
    fetch("http://localhost:3005/sns-feed/upload", {
      method: "POST",
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      console.log(data);
      // navigate("/feed"); // 원하는 경로
    })
    .catch(err => {
      console.error(err);
    });
  }



  const fnRegister = () => {
    fetch("http://localhost:3005/sns-feed", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body:
        JSON.stringify({
          email: sessionUser.email,
          title: titleRef.current.value,
          content: contentRef.current.value
        })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
        fnUploadFile(data.result.insertId);
      })
  }

  // const handleSubmit = () => {
  //   if (!title || !content) return alert("모든 항목을 입력해주세요.");
  //   let userId = sessionUser.email;
  //   console.log(userId);
  //   // fetch("http://localhost:3005/member/register"+ userId, {
  //   //     method: "POST",
  //   //     headers: {
  //   //         "Content-type": "application/json"
  //   //     },
  //   //     body: JSON.stringify({ title, content })
  //   // })
  //   //     .then(res => res.json())
  //   //     .then(data => {
  //   //         alert("등록 완료");
  //   //         console.log(data);
  //   //         // 4. 피드 등록 후 선택한 파일이 있으면 insert할때의 pk값을 담아서
  //   //         // 파일 업로드 함수 호출
  //   //         // if(files) {
  //   //         //   fnUploadFile(data.result.insertId);
  //   //         // } else {
  //   //         //   navigate("/feed"); // 원하는 경로
  //   //         // }
  //   //     })
  // };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="flex-start" // 상단 정렬
        minHeight="100vh"
        sx={{ padding: '20px' }} // 배경색 없음
      >
        <Typography variant="h4" gutterBottom>
          등록
        </Typography>

        <FormControl fullWidth margin="normal">
          <InputLabel>카테고리</InputLabel>
          <Select defaultValue="" label="카테고리">
            <MenuItem value={1}>실화 / 체험담</MenuItem>
            <MenuItem value={2}>목격담 / 제보</MenuItem>
            <MenuItem value={3}>꿈 / 예지몽</MenuItem>
            <MenuItem value={4}>설명할 수 없는 일</MenuItem>
          </Select>
        </FormControl>

        <TextField
          inputRef={titleRef}
          label="제목"
          variant="outlined"
          margin="normal"
          fullWidth
        // value={title}
        // onChange={(e) => setTitle(e.target.value)}
        />
        <TextField
          inputRef={contentRef}
          label="내용"
          variant="outlined"
          margin="normal"
          fullWidth
          multiline
          rows={4}
        // value={content}
        // onChange={(e) => setContent(e.target.value)}
        />

        <Box display="flex" alignItems="center" margin="normal" fullWidth>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            multiple
          />
          <label htmlFor="file-upload">
            <IconButton color="primary" component="span">
              <PhotoCamera />
            </IconButton>
          </label>
          {/* {file && (
            <Avatar
              alt="첨부된 이미지"
              src={URL.createObjectURL(file)}
              sx={{ width: 56, height: 56, marginLeft: 2 }}
            />
          )} */}
          <Typography variant="body1" sx={{ marginLeft: 2 }}>
            {file ? file.name : '첨부할 파일 선택'}
          </Typography>
        </Box>

        <Button onClick={fnRegister} variant="contained" color="primary" fullWidth style={{ marginTop: '20px' }}>
          등록하기
        </Button>
      </Box>
    </Container>
  );
}

export default Register;