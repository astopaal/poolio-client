import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Grid, Paper, Typography, IconButton, CircularProgress } from '@mui/material';
import { Add, Poll, Group, Assessment, Business } from '@mui/icons-material';
import MainLayout from '../../components/layout/MainLayout';
import { dashboardService } from './services/dashboardService';
import { fetchStart, fetchSuccess, fetchFailure } from './store/dashboardSlice';
import { showToast } from '../../components/Toast';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, icon, color }) => (
  <Paper
    elevation={0}
    sx={{
      p: 3,
      height: '100%',
      borderRadius: 4,
      background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
      color: 'white',
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <Box>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
          {value}
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          {title}
        </Typography>
      </Box>
      <IconButton sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}>
        {icon}
      </IconButton>
    </Box>
  </Paper>
);

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { stats, recentActivities, isLoading, error } = useSelector((state) => state.dashboard);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        dispatch(fetchStart());
        
        // Kullanıcı rolüne göre istatistikleri ve aktiviteleri getir
        const statsData = user.role === 'super_admin' 
          ? await dashboardService.getSystemStats()
          : await dashboardService.getCompanyStats();
          
        const activities = user.role === 'super_admin'
          ? await dashboardService.getSystemActivities()
          : await dashboardService.getCompanyActivities();
        
        dispatch(fetchSuccess({ stats: statsData, activities }));
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Veriler yüklenirken bir hata oluştu';
        dispatch(fetchFailure(errorMessage));
        showToast.error(errorMessage);
      }
    };

    fetchDashboardData();
  }, [dispatch, user.role]);

  const renderStatCards = () => {
    if (!stats) return null;

    if (user.role === 'super_admin') {
      return (
        <>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Aktif Şirketler"
              value={stats.companies?.active || 0}
              icon={<Business />}
              color="#1e3c72"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Aktif Kullanıcılar"
              value={stats.users?.active || 0}
              icon={<Group />}
              color="#2a5298"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Toplam Anket"
              value={stats.surveys?.total || 0}
              icon={<Poll />}
              color="#3366cc"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Toplam Yanıt"
              value={stats.responses?.total || 0}
              icon={<Assessment />}
              color="#4477dd"
            />
          </Grid>
        </>
      );
    }

    return (
      <>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Aktif Anketler"
            value={stats.surveys?.active || 0}
            icon={<Poll />}
            color="#1e3c72"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Toplam Yanıt"
            value={stats.responses?.total || 0}
            icon={<Assessment />}
            color="#2a5298"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Kullanıcılar"
            value={stats.users?.active || 0}
            icon={<Group />}
            color="#3366cc"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tamamlanma Oranı"
            value={`%${stats.responses?.completionRate || 0}`}
            icon={<Poll />}
            color="#4477dd"
          />
        </Grid>
      </>
    );
  };

  if (isLoading) {
    return (
      <MainLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        {/* Başlık */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
              {user.role === 'super_admin' ? 'Sistem Genel Bakış' : 'Hoş Geldiniz'}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {user.role === 'super_admin' 
                ? 'Tüm şirketler ve kullanıcıların genel durumu'
                : 'Anket yönetim sisteminize genel bakış'
              }
            </Typography>
          </Box>
          {user.role !== 'super_admin' && (
            <IconButton
              sx={{
                bgcolor: '#1e3c72',
                color: 'white',
                '&:hover': { bgcolor: '#2a5298' },
              }}
              onClick={() => navigate('/surveys/create')}
            >
              <Add />
            </IconButton>
          )}
        </Box>

        {/* İstatistik Kartları */}
        <Grid container spacing={3}>
          {renderStatCards()}
        </Grid>

        {/* Son Aktiviteler */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            Son Aktiviteler
          </Typography>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              bgcolor: 'white',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <Box 
                  key={activity.id}
                  sx={{ 
                    py: 2,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    '&:last-child': { borderBottom: 0, pb: 0 },
                    '&:first-of-type': { pt: 0 }
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {activity.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(activity.createdAt).toLocaleString('tr-TR')}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography color="text.secondary">
                Henüz aktivite bulunmuyor.
              </Typography>
            )}
          </Paper>
        </Box>
      </Box>
    </MainLayout>
  );
};

export default DashboardPage; 