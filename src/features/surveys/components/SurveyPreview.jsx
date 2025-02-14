import { useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Rating,
  FormControl,
  FormLabel,
  FormHelperText
} from '@mui/material';
import { QUESTION_TYPES } from './questions/QuestionTypes';

const SurveyPreview = () => {
  const { currentSurvey, questions } = useSelector(state => state.survey);

  const renderQuestion = (question) => {
    const isRequired = question.isRequired;
    const helperText = isRequired ? 'Bu soru zorunludur' : '';

    switch (question.type) {
      case QUESTION_TYPES.TEXT:
        return (
          <TextField
            fullWidth
            placeholder="Yanıtınız"
            required={isRequired}
            helperText={helperText}
            inputProps={{
              maxLength: question.validations?.maxLength,
              minLength: question.validations?.minLength
            }}
          />
        );

      case QUESTION_TYPES.LONG_TEXT:
        return (
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Yanıtınız"
            required={isRequired}
            helperText={helperText}
            inputProps={{
              maxLength: question.validations?.maxLength,
              minLength: question.validations?.minLength
            }}
          />
        );

      case QUESTION_TYPES.SINGLE_CHOICE:
        return (
          <FormControl required={isRequired}>
            <RadioGroup>
              {question.options?.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
          </FormControl>
        );

      case QUESTION_TYPES.MULTIPLE_CHOICE:
        return (
          <FormControl required={isRequired}>
            <FormGroup>
              {question.options?.map((option, index) => (
                <FormControlLabel
                  key={index}
                  control={<Checkbox />}
                  label={option}
                />
              ))}
            </FormGroup>
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
          </FormControl>
        );

      case QUESTION_TYPES.RATING:
        return (
          <FormControl required={isRequired}>
            <Rating
              max={question.validations?.max || 5}
              size="large"
            />
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
          </FormControl>
        );

      case QUESTION_TYPES.DATE:
        return (
          <TextField
            type="date"
            fullWidth
            required={isRequired}
            helperText={helperText}
            InputLabelProps={{
              shrink: true,
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', py: 4 }}>
      <Paper sx={{ p: 4 }}>
        {/* Anket Başlığı ve Açıklaması */}
        <Typography variant="h4" gutterBottom>
          {currentSurvey?.title || 'Adsız Anket'}
        </Typography>
        {currentSurvey?.description && (
          <Typography variant="body1" color="text.secondary" paragraph>
            {currentSurvey.description}
          </Typography>
        )}

        {/* Sorular */}
        {questions.map((question, index) => (
          <Box
            key={question.id}
            sx={{
              mt: 4,
              p: 3,
              bgcolor: 'grey.50',
              borderRadius: 2,
              '&:first-of-type': { mt: 3 }
            }}
          >
            <FormControl fullWidth>
              <FormLabel
                required={question.isRequired}
                sx={{
                  mb: 2,
                  color: 'text.primary',
                  '&.Mui-focused': { color: 'text.primary' }
                }}
              >
                <Typography variant="subtitle1" component="span">
                  {index + 1}. {question.text || 'Adsız Soru'}
                </Typography>
              </FormLabel>
              {renderQuestion(question)}
            </FormControl>
          </Box>
        ))}

        {questions.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">
              Henüz soru eklenmemiş
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default SurveyPreview; 