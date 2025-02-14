import api from '../../../services/api';
import { showToast } from '../../../components/Toast';

export const surveyService = {
  // Anket oluşturma
  async createSurvey(surveyData) {
    try {
      const response = await api.post('/surveys', surveyData);
      return response.data;
    } catch (error) {
      showToast.error('Anket oluşturulurken bir hata oluştu');
      throw error;
    }
  },

  // Anketleri listeleme
  async listSurveys() {
    try {
      const response = await api.get('/surveys');
      return response.data;
    } catch (error) {
      showToast.error('Anketler listelenirken bir hata oluştu');
      throw error;
    }
  },

  // Anket güncelleme
  async updateSurvey(surveyId, surveyData) {
    try {
      const response = await api.put(`/surveys/${surveyId}`, surveyData);
      return response.data;
    } catch (error) {
      showToast.error('Anket güncellenirken bir hata oluştu');
      throw error;
    }
  },

  // Anket silme
  async deleteSurvey(surveyId) {
    try {
      const response = await api.delete(`/surveys/${surveyId}`);
      return response.data;
    } catch (error) {
      showToast.error('Anket silinirken bir hata oluştu');
      throw error;
    }
  },

  // Anket yayınlama/yayından kaldırma
  async toggleSurveyPublish(surveyId) {
    try {
      const response = await api.post(`/surveys/${surveyId}/toggle-publish`);
      return response.data;
    } catch (error) {
      showToast.error('Anket durumu güncellenirken bir hata oluştu');
      throw error;
    }
  },

  // Soru ekleme
  async addQuestion(surveyId, questionData) {
    try {
      const response = await api.post(`/surveys/${surveyId}/questions`, questionData);
      return response.data;
    } catch (error) {
      showToast.error('Soru eklenirken bir hata oluştu');
      throw error;
    }
  },

  // Soru güncelleme
  async updateQuestion(surveyId, questionId, questionData) {
    try {
      const response = await api.put(`/surveys/${surveyId}/questions/${questionId}`, questionData);
      return response.data;
    } catch (error) {
      showToast.error('Soru güncellenirken bir hata oluştu');
      throw error;
    }
  },

  // Soru silme
  async deleteQuestion(surveyId, questionId) {
    try {
      const response = await api.delete(`/surveys/${surveyId}/questions/${questionId}`);
      return response.data;
    } catch (error) {
      showToast.error('Soru silinirken bir hata oluştu');
      throw error;
    }
  },

  // Soru sıralama
  async reorderQuestions(surveyId, questionOrders) {
    try {
      const response = await api.post(`/surveys/${surveyId}/questions/reorder`, { questionOrders });
      return response.data;
    } catch (error) {
      showToast.error('Sorular sıralanırken bir hata oluştu');
      throw error;
    }
  }
}; 