import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Box,
  TextField,
  IconButton,
  FormControlLabel,
  Switch,
  Collapse,
  Button,
  Typography,
  Divider
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Settings as SettingsIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { updateQuestion, removeQuestion } from '../../store/surveySlice';
import { QUESTION_TYPES } from './QuestionTypes';

const QuestionEditor = ({ question }) => {
  const dispatch = useDispatch();
  const [showSettings, setShowSettings] = useState(false);
  const [newOption, setNewOption] = useState('');

  const handleTextChange = (event) => {
    dispatch(updateQuestion({
      id: question.id,
      text: event.target.value
    }));
  };

  const handleRequiredChange = (event) => {
    dispatch(updateQuestion({
      id: question.id,
      isRequired: event.target.checked
    }));
  };

  const handleDeleteQuestion = () => {
    dispatch(removeQuestion(question.id));
  };

  const handleAddOption = () => {
    if (!newOption.trim()) return;

    const updatedOptions = [...(question.options || []), newOption.trim()];
    dispatch(updateQuestion({
      id: question.id,
      options: updatedOptions
    }));
    setNewOption('');
  };

  const handleDeleteOption = (index) => {
    const updatedOptions = question.options.filter((_, i) => i !== index);
    dispatch(updateQuestion({
      id: question.id,
      options: updatedOptions
    }));
  };

  const handleValidationChange = (field, value) => {
    dispatch(updateQuestion({
      id: question.id,
      validations: {
        ...question.validations,
        [field]: value
      }
    }));
  };

  const renderValidationSettings = () => {
    switch (question.type) {
      case QUESTION_TYPES.TEXT:
      case QUESTION_TYPES.LONG_TEXT:
        return (
          <>
            <TextField
              type="number"
              label="Minimum Karakter"
              value={question.validations?.minLength || 0}
              onChange={(e) => handleValidationChange('minLength', parseInt(e.target.value))}
              size="small"
              sx={{ width: 150, mr: 2 }}
            />
            <TextField
              type="number"
              label="Maximum Karakter"
              value={question.validations?.maxLength || 255}
              onChange={(e) => handleValidationChange('maxLength', parseInt(e.target.value))}
              size="small"
              sx={{ width: 150 }}
            />
          </>
        );
      case QUESTION_TYPES.RATING:
        return (
          <>
            <TextField
              type="number"
              label="Minimum Değer"
              value={question.validations?.min || 1}
              onChange={(e) => handleValidationChange('min', parseInt(e.target.value))}
              size="small"
              sx={{ width: 150, mr: 2 }}
            />
            <TextField
              type="number"
              label="Maximum Değer"
              value={question.validations?.max || 5}
              onChange={(e) => handleValidationChange('max', parseInt(e.target.value))}
              size="small"
              sx={{ width: 150 }}
            />
          </>
        );
      default:
        return null;
    }
  };

  const renderOptionsList = () => {
    if (![QUESTION_TYPES.SINGLE_CHOICE, QUESTION_TYPES.MULTIPLE_CHOICE].includes(question.type)) {
      return null;
    }

    return (
      <Box sx={{ mt: 2 }}>
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Seçenekler</Typography>
        {question.options?.map((option, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <TextField
              fullWidth
              size="small"
              value={option}
              onChange={(e) => {
                const updatedOptions = [...question.options];
                updatedOptions[index] = e.target.value;
                dispatch(updateQuestion({
                  id: question.id,
                  options: updatedOptions
                }));
              }}
            />
            <IconButton size="small" onClick={() => handleDeleteOption(index)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Yeni seçenek"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddOption();
              }
            }}
          />
          <IconButton size="small" onClick={handleAddOption}>
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
        <TextField
          fullWidth
          multiline
          label="Soru"
          value={question.text}
          onChange={handleTextChange}
          sx={{ mr: 2 }}
        />
        <IconButton onClick={() => setShowSettings(!showSettings)}>
          <SettingsIcon />
        </IconButton>
        <IconButton onClick={handleDeleteQuestion} color="error">
          <DeleteIcon />
        </IconButton>
      </Box>

      {renderOptionsList()}

      <Collapse in={showSettings}>
        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Soru Ayarları
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={question.isRequired}
                onChange={handleRequiredChange}
                size="small"
              />
            }
            label="Zorunlu"
          />
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle2" gutterBottom>
            Doğrulama Ayarları
          </Typography>
          <Box sx={{ mt: 1 }}>
            {renderValidationSettings()}
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default QuestionEditor; 