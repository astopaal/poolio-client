import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stats: null,
  recentActivities: [],
  isLoading: false,
  error: null
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    fetchStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchSuccess: (state, action) => {
      state.isLoading = false;
      state.stats = action.payload.stats;
      state.recentActivities = action.payload.activities;
      state.error = null;
    },
    fetchFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const { 
  fetchStart, 
  fetchSuccess, 
  fetchFailure,
  clearError 
} = dashboardSlice.actions;

export default dashboardSlice.reducer; 