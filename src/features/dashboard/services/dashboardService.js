import api from '../../../services/api';
import { showToast } from '../../../components/Toast';

export const dashboardService = {
  // Şirket istatistiklerini getir
  async getCompanyStats() {
    try {
      const response = await api.get('/company-admin/stats');
      return response.data;
    } catch (error) {
      showToast.error('İstatistikler yüklenirken bir hata oluştu');
      throw error;
    }
  },

  // Sistem istatistiklerini getir (Super Admin için)
  async getSystemStats() {
    try {
      const response = await api.get('/super-admin/stats');
      return response.data;
    } catch (error) {
      showToast.error('Sistem istatistikleri yüklenirken bir hata oluştu');
      throw error;
    }
  },

  // Şirket aktivitelerini getir (Company Admin için)
  async getCompanyActivities() {
    try {
      const response = await api.get('/company-admin/activities');
      return response.data;
    } catch (error) {
      console.error('Şirket aktiviteleri yüklenirken hata:', error);
      return []; // Hata durumunda boş dizi dön
    }
  },

  // Sistem aktivitelerini getir (Super Admin için)
  async getSystemActivities() {
    try {
      const response = await api.get('/super-admin/activities');
      return response.data;
    } catch (error) {
      console.error('Sistem aktiviteleri yüklenirken hata:', error);
      return []; // Hata durumunda boş dizi dön
    }
  }
}; 