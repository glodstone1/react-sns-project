import React from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate import(페이지 이동을 위해 필요)

function Join() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pwdCheck, setPwdCheck] = useState("");
  const [userName, setUserName] = useState("");
  const [nickName, setNickName] = useState("");
  const [intro, setIntro] = useState("");
  const [fearType, setFearType] = useState("");
  const navigate = useNavigate();  // 페이지 이동을 위한 함수 리턴
  const fearOptions = [
    { label: "유령", value: "Ghost" },
    { label: "실제괴담", value: "Scary Story" },
    { label: "외계인", value: "Alien" },
    { label: "폐가", value: "House" }
  ];

  const handleLogin = (e) => {
    e.preventDefault();

    if (password != pwdCheck) {
      alert("비밀번호 확인")
      return;
    }
    fetch("http://localhost:3005/pro-user/join", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body:
        JSON.stringify({
          email: email,
          pwd: password,
          userName: userName,
          nickName: nickName,
          intro: intro,
          fearType: fearType
        })
    })
      .then(res => res.json())
      .then(data => {
        if (data.result === "success") {
          alert(data.message);
          navigate("/prologin");
        } else {
          alert(data.message);
        }
      })

  }


  return (
    <Container maxWidth="xs">
      <Box
        component="form" noValidate autoComplete="off" onSubmit={handleLogin}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Typography variant="h4" gutterBottom>
          회원가입
        </Typography>
        <TextField
          label="이메일*"
          variant="outlined"
          margin="normal"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="비밀번호*"
          variant="outlined"
          margin="normal"
          fullWidth
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}

        />
        <TextField
          label="비밀번호 확인*"
          variant="outlined"
          margin="normal"
          fullWidth
          type="password"
          value={pwdCheck}
          onChange={(e) => setPwdCheck(e.target.value)}
        />
        <TextField
          label="이름*"
          variant="outlined"
          margin="normal"
          fullWidth
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <TextField
          label="별명*"
          variant="outlined"
          margin="normal"
          fullWidth
          value={nickName}
          onChange={(e) => setNickName(e.target.value)}
        />
        <TextField
          label="자기소개*"
          variant="outlined"
          margin="normal"
          fullWidth
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
        />
        <FormControl component="fieldset" fullWidth margin="normal">
  <FormLabel component="legend">공포유형*</FormLabel>
  <RadioGroup
    row
    value={fearType}
    onChange={(e) => setFearType(e.target.value)}
  >
    {fearOptions.map((item) => (
      <FormControlLabel
        key={item.value}
        value={item.value}           // 👉 저장될 값: 영어
        control={<Radio />}
        label={item.label}           // 👉 화면에 보이는 라벨: 한글
      />
    ))}
  </RadioGroup>
</FormControl>

        <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '20px' }}>
          회원가입
        </Button>
        <Typography variant="body2" style={{ marginTop: '10px' }}>
          이미 회원이라면? <Link to="/prologin">로그인</Link>
        </Typography>
      </Box>
    </Container>
  );
}

export default Join;