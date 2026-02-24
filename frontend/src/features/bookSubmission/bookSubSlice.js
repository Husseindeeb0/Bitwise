import { createSlice } from '@reduxjs/toolkit';
import {
  submitBookSubmission,
  deleteBookSubmission,
  getBookSubmissions,
  getBookSubmissionsByUserId,
} from './bookSubThunks';

const initialState = {
  submissions: [],
  userSubmissions: [],
  isLoading: false,
  error: null,
  success: false,
};

const bookSubmissionSlice = createSlice({
  name: 'bookSubmission',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    // submitBookSubmission
    builder
      .addCase(submitBookSubmission.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitBookSubmission.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
      })
      .addCase(submitBookSubmission.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // deleteBookSubmission
    builder
      .addCase(deleteBookSubmission.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteBookSubmission.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
      })
      .addCase(deleteBookSubmission.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // getBookSubmissions
    builder
      .addCase(getBookSubmissions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getBookSubmissions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.submissions = action.payload;
      })
      .addCase(getBookSubmissions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // getBookSubmissionsByUserId
    builder
      .addCase(getBookSubmissionsByUserId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getBookSubmissionsByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = true;
        state.userSubmissions = action.payload;
      })
      .addCase(getBookSubmissionsByUserId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const bookSubmissionActions = bookSubmissionSlice.actions;
export default bookSubmissionSlice.reducer;
