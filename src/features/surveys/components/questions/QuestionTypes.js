import {
  ShortText,
  Subject,
  RadioButtonChecked,
  CheckBox,
  Star,
  CalendarMonth
} from '@mui/icons-material';

export const QUESTION_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  SINGLE_CHOICE: 'single_choice',
  MULTIPLE_CHOICE: 'multiple_choice',
  RATING: 'rating',
  DATE: 'date'
};

export const QUESTION_TYPE_LABELS = {
  [QUESTION_TYPES.TEXT]: 'Metin',
  [QUESTION_TYPES.NUMBER]: 'Sayı',
  [QUESTION_TYPES.SINGLE_CHOICE]: 'Çoktan Seçmeli (Tek Seçim)',
  [QUESTION_TYPES.MULTIPLE_CHOICE]: 'Çoktan Seçmeli (Çoklu Seçim)',
  [QUESTION_TYPES.RATING]: 'Değerlendirme',
  [QUESTION_TYPES.DATE]: 'Tarih'
};

export const QUESTION_TYPE_ICONS = {
  [QUESTION_TYPES.TEXT]: ShortText,
  [QUESTION_TYPES.NUMBER]: Subject,
  [QUESTION_TYPES.SINGLE_CHOICE]: RadioButtonChecked,
  [QUESTION_TYPES.MULTIPLE_CHOICE]: CheckBox,
  [QUESTION_TYPES.RATING]: Star,
  [QUESTION_TYPES.DATE]: CalendarMonth
};

export const getDefaultValidation = (type) => {
  switch (type) {
    case QUESTION_TYPES.TEXT:
      return { minLength: 0, maxLength: 255 };
    case QUESTION_TYPES.NUMBER:
      return { min: 0, max: 100 };
    case QUESTION_TYPES.RATING:
      return { min: 1, max: 5 };
    default:
      return {};
  }
};

export const getEmptyQuestion = (type, order) => ({
  type,
  text: '',
  isRequired: false,
  order: order || 0,
  options: ['single_choice', 'multiple_choice'].includes(type) ? [] : undefined,
  validations: getDefaultValidation(type)
}); 