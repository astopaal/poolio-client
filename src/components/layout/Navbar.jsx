import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Divider,
  Button
} from '@mui/material';
import { Logout, Settings, Person, Dashboard, Poll } from '@mui/icons-material';
import { authService } from '../../features/auth/services/authService';
import { logout } from '../../features/auth/store/authSlice';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error('Çıkış yapılırken hata oluştu:', error);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        backgroundColor: 'white',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo ve Navigasyon */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#1e3c72',
              borderRadius: 2,
              p: 1,
              mr: 2
            }}
          >
            <Box
              component="img"
              src="/logo.webp"
              alt="Poolio Logo"
              sx={{ height: 32 }}
            />
          </Box>

          {/* Navigasyon Menüsü */}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              component={Link}
              to="/dashboard"
              startIcon={<Dashboard />}
              sx={{ color: 'text.primary' }}
            >
              Dashboard
            </Button>
            <Button
              component={Link}
              to="/surveys"
              startIcon={<Poll />}
              sx={{ color: 'text.primary' }}
            >
              Anketler
            </Button>
          </Box>
        </Box>

        {/* User Menu */}
        {user && (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography
              sx={{
                mr: 2,
                color: 'text.primary',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              {user.firstName} {user.lastName}
            </Typography>
            
            <Tooltip title="Hesap ayarları">
              <IconButton onClick={handleMenu} size="small">
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: '#1e3c72',
                    fontSize: '1rem',
                  }}
                >
                  {getInitials(`${user.firstName} ${user.lastName}`)}
                </Avatar>
              </IconButton>
            </Tooltip>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                sx: {
                  mt: 1,
                  minWidth: 200,
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                }
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Box sx={{ px: 2, py: 1 }}>
                <Typography sx={{ fontWeight: 500 }}>
                  {user.firstName} {user.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email}
                </Typography>
              </Box>
              
              <Divider />
              
              <MenuItem onClick={() => navigate('/profile')} sx={{ py: 1.5 }}>
                <Person sx={{ mr: 2, fontSize: 20 }} />
                Profil
              </MenuItem>
              
              <MenuItem onClick={() => navigate('/settings')} sx={{ py: 1.5 }}>
                <Settings sx={{ mr: 2, fontSize: 20 }} />
                Ayarlar
              </MenuItem>
              
              <Divider />
              
              <MenuItem onClick={handleLogout} sx={{ py: 1.5, color: 'error.main' }}>
                <Logout sx={{ mr: 2, fontSize: 20 }} />
                Çıkış Yap
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 