import { createSlice } from '@reduxjs/toolkit';
import {
  createBookForm,
  updateBookForm,
  deleteBookForm,
} from './bookFormThunks';

const initialState = {
  isLoading: false,
  error: null,
  success: false,
};

const bookFormSlice = createSlice({
  name: 'bookForm',
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
    // createBookForm
    builder
      .addCase(createBookForm.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createBookForm.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
      })
      .addCase(createBookForm.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // updateBookForm
    builder
      .addCase(updateBookForm.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateBookForm.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
      })
      .addCase(updateBookForm.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // deleteBookForm
    builder
      .addCase(deleteBookForm.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteBookForm.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
      })
      .addCase(deleteBookForm.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const bookFormActions = bookFormSlice.actions;
export default bookFormSlice.reducer;
