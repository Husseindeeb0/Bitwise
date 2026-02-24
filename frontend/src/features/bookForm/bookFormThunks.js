import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  createBookFormAPI,
  updateBookFormAPI,
  deleteBookFormAPI,
} from './bookFormAPI';

export const createBookForm = createAsyncThunk(
  'bookForm/createBookForm',
  async (bookFormData, thunkAPI) => {
    try {
      const res = await createBookFormAPI(bookFormData);
      return res.data;
    } catch (error) {
      console.error(`Error in create book form thunk: ${error}`);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue('Create book form thunk failed');
    }
  }
);

export const updateBookForm = createAsyncThunk(
  'bookForm/updateBookForm',
  async (bookFormData, thunkAPI) => {
    try {
      const res = await updateBookFormAPI(bookFormData);
      return res.data;
    } catch (error) {
      console.error(`Error in update book form thunk: ${error}`);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue('Update book form thunk failed');
    }
  }
);

export const deleteBookForm = createAsyncThunk(
  'bookForm/deleteBookForm',
  async (bookFormId, thunkAPI) => {
    try {
      const res = await deleteBookFormAPI(bookFormId);
      return res.data;
    } catch (error) {
      console.error(`Error in delete book form thunk: ${error}`);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue('Delete book form thunk failed');
    }
  }
);
