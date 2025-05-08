import { Box, TextField, Container, Link, Paper, Button, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate import(페이지 이동을 위해 필요)
import '@fontsource/pacifico'; // 필기체 폰트 추가

export default function ProLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();  // 페이지 이동을 위한 함수 리턴
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const [shouldNavigate, setShouldNavigate] = useState(false); // 로그인 성공시 다이얼로그

  const handleLogin = (e) => {
    e.preventDefault();



    if (email && password) {
      fetch("http://localhost:3005/pro-user", {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body:
          JSON.stringify({
            email: email,
            pwd: password
          })

      })
        .then(res => res.json())
        .then(data => {
          console.log("토큰==>", data.token);
          if (data.success) {
            setDialogMessage(data.message);
            setDialogOpen(true);
            localStorage.setItem("token", data.token);
            setShouldNavigate(true);  // 이동 예약
          } else {
            setDialogMessage(data.message);
            setDialogOpen(true);
          }
        })

    } else {
      setDialogMessage("아이디와 비밀번호를 입력해주세요.");
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
    <Container maxWidth="xs" sx={{ mt: 15 }}>
      <Paper elevation={3} sx={{ p: 4, bgcolor: "#fff" }}>
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography variant="h4" sx={{ fontFamily: 'Pacifico, cursive' }}>
            MechaArashi
          </Typography>
        </Box>
        <Box component="form" noValidate autoComplete="off" onSubmit={handleLogin}>
          <TextField
            fullWidth
            margin="normal"
            label="이메일*"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="비밀번호*"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            type="submit"
          >
            로그인
          </Button>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            {/* <Link href="#" underline="hover" sx={{ fontSize: "0.8rem" }}>회원가입</Link>
            <Link href="#" underline="hover" sx={{ fontSize: "0.8rem" }}>비밀번호 찾기</Link> */}
            <Typography variant="body2" style={{ marginTop: '10px', fontSize: "0.8rem" }}>
              아직 회원이 아니신가요? <Link href="/join">회원가입</Link>
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* 로그인 결과 다이얼로그 */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>알림</DialogTitle>
        <DialogContent>
          <Typography>{dialogMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>확인</Button>
        </DialogActions>
      </Dialog>
    </Container >
  );
}