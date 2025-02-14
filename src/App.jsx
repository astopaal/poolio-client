import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider, useDispatch } from 'react-redux';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import store from './store';
import theme from './theme'; // Henüz oluşturmadık
import LoginPage from './features/auth/components/LoginPage';
import DashboardPage from './features/dashboard/DashboardPage';
import UnauthorizedPage from './features/auth/components/UnauthorizedPage';
import CreateSurveyPage from './features/surveys/pages/CreateSurveyPage';
import SurveyListPage from './features/surveys/pages/SurveyListPage';
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import { authService } from './features/auth/services/authService';
import { loginSuccess, initializeAuth, logout } from './features/auth/store/authSlice';
import Toast from './components/Toast';
import { showToast } from './components/Toast';

const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initApp = () => {
      try {
        const user = authService.getStoredUser();
        if (user) {
          dispatch(loginSuccess(user));
        } else {
          // Eğer kullanıcı bilgileri eksikse logout yap
          dispatch(logout());
          showToast.error('Oturum süreniz doldu, lütfen tekrar giriş yapın');
        }
      } catch (error) {
        console.error('Uygulama başlatılırken hata:', error);
        dispatch(logout());
      } finally {
        dispatch(initializeAuth());
      }
    };

    initApp();
  }, [dispatch]);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        
        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/surveys"
          element={
            <ProtectedRoute>
              <SurveyListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/surveys/create"
          element={
            <ProtectedRoute roles={['editor', 'company_admin']}>
              <CreateSurveyPage />
            </ProtectedRoute>
          }
        />

        {/* Default route */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Toast />
    </Router>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
