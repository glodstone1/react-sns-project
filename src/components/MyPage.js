import React from 'react';
import { Container, Box, Typography, Avatar, Paper, Grid } from '@mui/material';

function MyPage() {
  return (
    <Container maxWidth="md" sx={{ backgroundColor: '#000', minHeight: '100vh', color: '#fff', paddingTop: '20px' }}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="flex-start"
        minHeight="100vh"
      >
        <Paper
          sx={{
            backgroundColor: '#1a1a1a',
            padding: '30px',
            borderRadius: '15px',
            width: '100%',
            color: '#fff',
          }}
        >
          {/* 프로필 */}
          <Box display="flex" flexDirection="column" alignItems="center" sx={{ marginBottom: 3 }}>
            <Avatar
              alt="프로필 이미지"
              src="https://images.unsplash.com/photo-1521747116042-5a810fda9664"
              sx={{ width: 120, height: 120, marginBottom: 2, border: '2px solid #ff1744' }}
            />
            <Typography variant="h4" sx={{ fontFamily: 'Creepster, cursive', color: '#fff' }}>홍길동</Typography>
            <Typography variant="body2" sx={{ color: '#ccc' }}>@honggildong</Typography>
          </Box>

          {/* 통계 */}
          <Grid container spacing={2} sx={{ marginTop: 2 }}>
            <Grid item xs={4} textAlign="center">
              <Typography variant="h6" sx={{ color: '#fff' }}>👁️ 추종자</Typography>
              <Typography variant="body1" sx={{ color: '#fff' }}>150</Typography>
            </Grid>
            <Grid item xs={4} textAlign="center">
              <Typography variant="h6" sx={{ color: '#fff' }}>🕯️ 동행자</Typography>
              <Typography variant="body1" sx={{ color: '#fff' }}>100</Typography>
            </Grid>
            <Grid item xs={4} textAlign="center">
              <Typography variant="h6" sx={{ color: '#fff' }}>📜 기록</Typography>
              <Typography variant="body1" sx={{ color: '#fff' }}>50</Typography>
            </Grid>
          </Grid>

          {/* 소개글 */}
          <Box sx={{ marginTop: 4 }}>
            <Typography variant="h6" sx={{ color: '#ff1744' }}>저주받은 소개</Typography>
            <Typography variant="body1" sx={{ color: '#fff' }}>
              어둠 속에서도 진실을 추구합니다... 폐허 속 이야기, 잊혀진 기억을 공유합니다.
            </Typography>
          </Box>

          {/* 무서운 이야기 */}
          <Box sx={{ marginTop: 4 }}>
            <Typography variant="h6" sx={{ color: '#ff1744' }}>🔮 나의 이야기</Typography>
            <Typography variant="body2" sx={{ color: '#fff' }}>
              한밤중, 아무도 없는 폐가에서 들렸던 낮은 웃음소리...  
              그 이후 나는 무언가에게 계속 쫓기고 있어요.
            </Typography>
          </Box>

          {/* 불길한 문구 */}
          <Box sx={{ marginTop: 5, textAlign: 'center' }}>
            <Typography variant="caption" sx={{ color: '#888' }}>
              당신을 지켜보는 이가 있습니다...
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default MyPage;