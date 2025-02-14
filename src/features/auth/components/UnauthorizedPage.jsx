import { Container, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Yetkisiz Erişim
      </Typography>
      <Typography variant="body1" paragraph>
        Bu sayfaya erişim yetkiniz bulunmamaktadır.
      </Typography>
      <Button variant="contained" onClick={() => navigate(-1)}>
        Geri Dön
      </Button>
    </Container>
  );
};

export default UnauthorizedPage; 