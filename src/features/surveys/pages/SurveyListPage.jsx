import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Tooltip
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Share as ShareIcon
} from '@mui/icons-material';
import MainLayout from '../../../components/layout/MainLayout';
import { surveyService } from '../services/surveyService';
import { showToast } from '../../../components/Toast';

const SurveyListPage = () => {
  const navigate = useNavigate();
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSurveys();
  }, []);

  const loadSurveys = async () => {
    try {
      const response = await surveyService.listSurveys();
      setSurveys(response);
    } catch (error) {
      showToast.error('Anketler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSurvey = () => {
    navigate('/surveys/create');
  };

  const handleEditSurvey = (surveyId) => {
    navigate(`/surveys/${surveyId}/edit`);
  };

  const handleViewSurvey = (surveyId) => {
    navigate(`/surveys/${surveyId}`);
  };

  const handleDeleteSurvey = async (surveyId) => {
    if (window.confirm('Bu anketi silmek istediğinize emin misiniz?')) {
      try {
        await surveyService.deleteSurvey(surveyId);
        showToast.success('Anket başarıyla silindi');
        loadSurveys();
      } catch (error) {
        showToast.error('Anket silinirken bir hata oluştu');
      }
    }
  };

  const getStatusChipProps = (status, isPublished) => {
    if (isPublished) {
      return {
        label: 'Yayında',
        color: 'success'
      };
    }
    return {
      label: 'Taslak',
      color: 'default'
    };
  };

  return (
    <MainLayout>
      <Box sx={{ p: 3 }}>
        {/* Başlık ve Yeni Anket Butonu */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h1">
            Anketlerim
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateSurvey}
          >
            Yeni Anket
          </Button>
        </Box>

        {/* Anket Listesi */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Anket Adı</TableCell>
                <TableCell>Durum</TableCell>
                <TableCell>Soru Sayısı</TableCell>
                <TableCell>Oluşturulma Tarihi</TableCell>
                <TableCell align="right">İşlemler</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {surveys.map((survey) => (
                <TableRow key={survey.id}>
                  <TableCell>{survey.title}</TableCell>
                  <TableCell>
                    <Chip
                      {...getStatusChipProps(survey.status, survey.isPublished)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{survey.questionCount}</TableCell>
                  <TableCell>
                    {new Date(survey.createdAt).toLocaleDateString('tr-TR')}
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="Görüntüle">
                      <IconButton
                        size="small"
                        onClick={() => handleViewSurvey(survey.id)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    {!survey.isPublished && (
                      <Tooltip title="Düzenle">
                        <IconButton
                          size="small"
                          onClick={() => handleEditSurvey(survey.id)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {!survey.isPublished && (
                      <Tooltip title="Sil">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDeleteSurvey(survey.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {survey.isPublished && (
                      <Tooltip title="Paylaş">
                        <IconButton
                          size="small"
                          color="primary"
                        >
                          <ShareIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {surveys.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography color="text.secondary">
                      Henüz anket oluşturmadınız
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </MainLayout>
  );
};

export default SurveyListPage; 