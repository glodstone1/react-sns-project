import {
  Box, TextField, Container, Link, Paper,
  Button, Typography, Dialog, DialogTitle,
  DialogContent, DialogActions
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import '@fontsource/cinzel'; // 고딕 느낌 폰트
import '@fontsource/noto-sans-kr'; // 한글 폰트
import socket from '../socket'; // ✅ socket 객체 불러오기

export default function ProLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [shouldNavigate, setShouldNavigate] = useState(false);

  // ✅ 로그인 처리 함수
  const handleLogin = (e) => {
    e.preventDefault();
    if (email && password) {
      fetch("http://localhost:3005/pro-user", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ email, pwd: password })
      })
        .then(res => res.json())
        .then(data => {
          setDialogMessage(data.message);
          setDialogOpen(true);

          if (data.success) {
            // ✅ 1. 토큰 저장
            localStorage.setItem("token", data.token);
            setShouldNavigate(true);

            // ✅ 2. 토큰 디코딩 → 이메일 추출
            const decoded = jwtDecode(data.token);
            const myEmail = decoded.email;

            // ✅ 3. 소켓 연결 + register
            socket.connect();                   // 소켓 연결 시작
            socket.emit('register', myEmail);   // 서버에 내 이메일 등록
          }
        });
    } else {
      setDialogMessage("이메일과 비밀번호를 모두 입력해주세요.");
      setDialogOpen(true);
    }
  };

  // ✅ 알림창 닫고 이동
  const handleDialogClose = () => {
    setDialogOpen(false);
    if (shouldNavigate) {
      navigate("/feed"); // ✅ 로그인 성공 후 피드로 이동
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 18 }}>
      <Paper elevation={0} sx={{
        p: 4,
        color: "#ccc",
        border: "1px solid #222",
        padding: '20px',
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 3,
        boxShadow: '0 0 10px rgba(255, 0, 0, 0.3)',
        backdropFilter: 'blur(5px)'
      }}>
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography variant="h4" sx={{ fontFamily: 'Cinzel', color: "#e53935" }}>
            이 얘기, 해도 될까?
          </Typography>
          <Typography sx={{ fontSize: "0.9rem", color: "#888" }}>
            남들에게 하지 못한 이야기... 당신에게도 있나요?
          </Typography>
        </Box>

        {/* 로그인 폼 */}
        <Box component="form" noValidate autoComplete="off" onSubmit={handleLogin}>
          <TextField
            fullWidth margin="normal"
            label="이메일"
            InputLabelProps={{ style: { color: '#888' } }}
            InputProps={{ style: { color: '#eee', backgroundColor: "#111" } }}
            value={email} onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth margin="normal"
            label="비밀번호"
            type="password"
            InputLabelProps={{ style: { color: '#888' } }}
            InputProps={{ style: { color: '#eee', backgroundColor: "#111" } }}
            value={password} onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            fullWidth type="submit"
            sx={{ mt: 3, bgcolor: "#b71c1c", color: "#fff", '&:hover': { bgcolor: "#7f0000" } }}
          >
            입장하기
          </Button>
          <Typography variant="body2" sx={{ mt: 2, textAlign: "center", fontSize: "0.8rem", color: "#777" }}>
            아직 회원이 아니신가요? <Link href="/join" sx={{ color: "#e53935" }}>가입하러 가기</Link>
          </Typography>
        </Box>
      </Paper>

      {/* 로그인 결과 알림창 */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>알림</DialogTitle>
        <DialogContent>
          <Typography>{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>확인</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}