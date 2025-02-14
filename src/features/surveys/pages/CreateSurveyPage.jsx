import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Tabs,
  Tab,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import MainLayout from '../../../components/layout/MainLayout';
import SurveyForm from '../components/SurveyForm';
import SurveyPreview from '../components/SurveyPreview';
import { surveyService } from '../services/surveyService';
import { clearSurvey, initializeSurvey } from '../store/surveySlice';
import { showToast } from '../../../components/Toast';

const CreateSurveyPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const { currentSurvey, questions, isDirty } = useSelector(state => state.survey);

  useEffect(() => {
    dispatch(clearSurvey());
    dispatch(initializeSurvey());
  }, [dispatch]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleSave = async () => {
    try {
      if (!currentSurvey?.title) {
        showToast.error('Lütfen anket başlığını giriniz');
        return;
      }

      if (questions.length === 0) {
        showToast.error('Lütfen en az bir soru ekleyiniz');
        return;
      }

      // Önce anketi oluştur
      const surveyData = {
        ...currentSurvey
      };

      const response = await surveyService.createSurvey(surveyData);
      const surveyId = response.survey.id;

      // Sonra her soruyu tek tek ekle
      for (let i = 0; i < questions.length; i++) {
        const questionData = {
          ...questions[i],
          order: i
        };
        console.log('Gönderilen soru verisi:', questionData);
        await surveyService.addQuestion(surveyId, questionData);
      }

      showToast.success('Anket başarıyla oluşturuldu');
      dispatch(clearSurvey());
      navigate(`/surveys/${surveyId}`);
    } catch (error) {
      showToast.error('Anket oluşturulurken bir hata oluştu');
    }
  };

  const handleExit = () => {
    if (isDirty) {
      setShowExitDialog(true);
    } else {
      dispatch(clearSurvey());
      navigate('/surveys');
    }
  };

  const handleConfirmExit = () => {
    dispatch(clearSurvey());
    navigate('/surveys');
  };

  return (
    <MainLayout>
      <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {/* Üst Bar */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, pt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label="Düzenle" />
              <Tab label="Önizle" />
            </Tabs>
            <Box>
              <Button
                variant="outlined"
                onClick={handleExit}
                sx={{ mr: 2 }}
              >
                İptal
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={!isDirty}
              >
                Kaydet
              </Button>
            </Box>
          </Box>
        </Box>

        {/* İçerik */}
        <Box sx={{ p: 3 }}>
          {activeTab === 0 ? <SurveyForm /> : <SurveyPreview />}
        </Box>
      </Box>

      {/* Çıkış Onay Dialog */}
      <Dialog
        open={showExitDialog}
        onClose={() => setShowExitDialog(false)}
      >
        <DialogTitle>
          Çıkış yapmak istediğinize emin misiniz?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Kaydedilmemiş değişiklikleriniz kaybolacak.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowExitDialog(false)}>
            İptal
          </Button>
          <Button onClick={handleConfirmExit} color="error">
            Çık
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default CreateSurveyPage; 