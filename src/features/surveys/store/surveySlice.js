import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentSurvey: {
    title: '',
    description: '',
    isPublished: false,
    status: 'draft'
  },
  questions: [],
  isLoading: false,
  error: null,
  isDirty: false
};

const surveySlice = createSlice({
  name: 'survey',
  initialState,
  reducers: {
    // Anket işlemleri
    initializeSurvey: (state) => {
      state.currentSurvey = initialState.currentSurvey;
      state.questions = [];
      state.isDirty = false;
    },
    setSurvey: (state, action) => {
      state.currentSurvey = action.payload;
      state.questions = action.payload.questions || [];
      state.isDirty = false;
    },
    updateSurveyField: (state, action) => {
      const { field, value } = action.payload;
      state.currentSurvey[field] = value;
      state.isDirty = true;
    },
    clearSurvey: (state) => {
      state.currentSurvey = null;
      state.questions = [];
      state.isDirty = false;
    },

    // Soru işlemleri
    addQuestion: (state, action) => {
      state.questions.push(action.payload);
      state.isDirty = true;
    },
    updateQuestion: (state, action) => {
      const { id, ...updates } = action.payload;
      const questionIndex = state.questions.findIndex(q => q.id === id);
      if (questionIndex !== -1) {
        state.questions[questionIndex] = { ...state.questions[questionIndex], ...updates };
        state.isDirty = true;
      }
    },
    removeQuestion: (state, action) => {
      state.questions = state.questions.filter(q => q.id !== action.payload);
      state.isDirty = true;
    },
    reorderQuestions: (state, action) => {
      state.questions = action.payload;
      state.isDirty = true;
    },

    // Yükleme durumu
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const {
  initializeSurvey,
  setSurvey,
  updateSurveyField,
  clearSurvey,
  addQuestion,
  updateQuestion,
  removeQuestion,
  reorderQuestions,
  setLoading,
  setError,
  clearError
} = surveySlice.actions;

export default surveySlice.reducer; 