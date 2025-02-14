import { Box, Container } from '@mui/material';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import LoginForm from './LoginForm';

const LoginPage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Eğer kullanıcı zaten giriş yapmışsa dashboard'a yönlendir
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      }}
    >
      {/* Sol Panel - Branding */}
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          p: 4,
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.2)',
            zIndex: 1,
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <Box
            component="img"
            src="/logo.webp" // Logo eklenecek
            alt="Poolio Logo"
            sx={{ width: 120, mb: 4 }}
          />
          <Box
            component="p"
            sx={{
              fontSize: '1.1rem',
              maxWidth: 400,
              mx: 'auto',
              opacity: 0.9
            }}
          >
            Profesyonel anket yönetim sistemi ile verilerinizi analiz edin, 
            müşterilerinizi daha iyi anlayın.
          </Box>
        </Box>
      </Box>

      {/* Sağ Panel - Login Form */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: 'white',
          boxShadow: '-4px 0 20px rgba(0,0,0,0.1)',
        }}
      >
        <Container maxWidth="xs">
          <LoginForm />
        </Container>
      </Box>
    </Box>
  );
};

export default LoginPage; 