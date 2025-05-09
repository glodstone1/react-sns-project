import {
  Box, TextField, Container, Link, Paper,
  Button, Typography, Dialog, DialogTitle,
  DialogContent, DialogActions
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import '@fontsource/cinzel'; // 고딕 느낌 폰트 추가
import '@fontsource/noto-sans-kr'; // 한글 기본 폰트

export default function ProLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [shouldNavigate, setShouldNavigate] = useState(false);

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
            localStorage.setItem("token", data.token);
            console.log(data.token);
            setShouldNavigate(true);
          }
        });
    } else {
      setDialogMessage("이메일과 비밀번호를 모두 입력해주세요.");
      setDialogOpen(true);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    if (shouldNavigate) {
      navigate("/feed");
    }
  };

  return (
    <Container maxWidth="xs" 
    sx={{ mt: 18}}>
      <Paper elevation={0} sx={{
        p: 4,
        color: "#ccc", // 텍스트 흐리게
        border: "1px solid #222", // 카드 경계만 흐릿하게
        padding: '20px',
        backgroundColor: 'rgba(0,0,0,0.6)', // 카드 배경도 검정
        borderRadius: 3,
        boxShadow: '0 0 10px rgba(255, 0, 0, 0.3)',
        backdropFilter: 'blur(5px)'
      }}>
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography variant="h4" sx={{ fontFamily: 'Cinzel', color: "#e53935" }}>
          이 얘기, 해도 될까?
          </Typography>
          <Typography sx={{ fontSize: "0.9rem", color: "#888" }}>
            남들에게 하지 못한 이야기... 당신에게도 뭔가가 있나요?
          </Typography>
        </Box>
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
            아직 어둠의 세계에 발을 들이지 않으셨나요? <Link href="/join" sx={{ color: "#e53935" }}>가입하러 가기</Link>
          </Typography>
        </Box>
      </Paper>

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