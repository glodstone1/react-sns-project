import React, { useState } from 'react';
import {
  TextField, Button, Container, Typography, Box,
  FormControl, FormLabel, RadioGroup,
  FormControlLabel, Radio, Paper
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import '@fontsource/cinzel'; // 고딕 느낌 폰트 추가

function Join() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pwdCheck, setPwdCheck] = useState("");
  const [userName, setUserName] = useState("");
  const [nickName, setNickName] = useState("");
  const [intro, setIntro] = useState("");
  const [fearType, setFearType] = useState("");
  const navigate = useNavigate();

  const fearOptions = [
    { label: "실화", value: "real" },
    { label: "목격담", value: "watch" },
    { label: "꿈", value: "dream" },
    { label: "불가사의", value: "mystery" }
  ];

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email) {
      alert("이메일 입력 요망");
      return;
    }
    if (password !== pwdCheck) {
      alert("비밀번호 확인");
      return;
    }

    fetch("http://localhost:3005/pro-user/join", {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        email, pwd: password, userName, nickName, intro, fearType
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
      });
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 8, bgcolor: "#000", minHeight: "100vh" }}>
      <Paper elevation={0} sx={{
        p: 4,
        bgcolor: "#000",
        color: "#ccc",
        border: "1px solid #222"
      }}>
        <Box component="form" onSubmit={handleLogin} noValidate autoComplete="off">
          <Typography variant="h4" gutterBottom sx={{
            fontFamily: 'Cinzel',
            color: '#e53935',
            textAlign: "center"
          }}>
            새로운 영혼을 초대합니다
          </Typography>
          <Typography variant="body2" sx={{ textAlign: "center", mb: 2, color: "#888" }}>
            여긴 당신의 이야기가 시작되는 곳입니다.
          </Typography>

          <TextField
            label="이메일*"
            fullWidth margin="normal"
            InputLabelProps={{ style: { color: '#888' } }}
            InputProps={{ style: { color: '#eee', backgroundColor: "#111" } }}
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="비밀번호*"
            type="password"
            fullWidth margin="normal"
            InputLabelProps={{ style: { color: '#888' } }}
            InputProps={{ style: { color: '#eee', backgroundColor: "#111" } }}
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            label="비밀번호 확인*"
            type="password"
            fullWidth margin="normal"
            InputLabelProps={{ style: { color: '#888' } }}
            InputProps={{ style: { color: '#eee', backgroundColor: "#111" } }}
            value={pwdCheck} onChange={(e) => setPwdCheck(e.target.value)}
          />
          <TextField
            label="이름*"
            fullWidth margin="normal"
            InputLabelProps={{ style: { color: '#888' } }}
            InputProps={{ style: { color: '#eee', backgroundColor: "#111" } }}
            value={userName} onChange={(e) => setUserName(e.target.value)}
          />
          <TextField
            label="별명*"
            fullWidth margin="normal"
            InputLabelProps={{ style: { color: '#888' } }}
            InputProps={{ style: { color: '#eee', backgroundColor: "#111" } }}
            value={nickName} onChange={(e) => setNickName(e.target.value)}
          />
          <TextField
            label="자기소개*"
            fullWidth margin="normal"
            InputLabelProps={{ style: { color: '#888' } }}
            InputProps={{ style: { color: '#eee', backgroundColor: "#111" } }}
            value={intro} onChange={(e) => setIntro(e.target.value)}
          />

          <FormControl component="fieldset" fullWidth margin="normal">
            <FormLabel sx={{ color: "#aaa", mb: 1 }}>공포유형*</FormLabel>
            <RadioGroup
              row
              value={fearType}
              onChange={(e) => setFearType(e.target.value)}
            >
              {fearOptions.map((item) => (
                <FormControlLabel
                  key={item.value}
                  value={item.value}
                  control={<Radio sx={{ color: "#e53935" }} />}
                  label={<Typography sx={{ color: "#ccc" }}>{item.label}</Typography>}
                />
              ))}
            </RadioGroup>
          </FormControl>

          <Button
            type="submit"
            fullWidth
            sx={{ mt: 3, bgcolor: "#b71c1c", color: "#fff", '&:hover': { bgcolor: "#7f0000" } }}
          >
            가입하기
          </Button>

          <Typography variant="body2" sx={{ mt: 2, textAlign: "center", fontSize: "0.8rem", color: "#777" }}>
            이미 어둠에 발을 들이셨나요? <Link to="/prologin" style={{ color: "#e53935" }}>로그인</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default Join;