import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  submitBookSubmissionAPI,
  deleteBookSubmissionAPI,
  getBookSubmissionsAPI,
  getBookSubmissionsByUserIdAPI,
} from './bookSubAPI';

export const submitBookSubmission = createAsyncThunk(
  'bookSubmission/submitBookSubmission',
  async (submissionData, thunkAPI) => {
    try {
      const res = await submitBookSubmissionAPI(submissionData);
      return res.data;
    } catch (error) {
      console.error(`Error in submit book submission thunk: ${error}`);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue('Submit book submission thunk failed');
    }
  }
);

export const deleteBookSubmission = createAsyncThunk(
  'bookSubmission/deleteBookSubmission',
  async (bookSubmissionId, thunkAPI) => {
    try {
      const res = await deleteBookSubmissionAPI(bookSubmissionId);
      return res.data;
    } catch (error) {
      console.error(`Error in delete book submission thunk: ${error}`);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue('Delete book submission thunk failed');
    }
  }
);

export const getBookSubmissions = createAsyncThunk(
  'bookSubmission/getBookSubmissions',
  async (announcementId, thunkAPI) => {
    try {
      const res = await getBookSubmissionsAPI(announcementId);
      return res.data.bookSubmissions;
    } catch (error) {
      console.error(`Error in get book submissions thunk: ${error}`);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue('Get book submissions thunk failed');
    }
  }
);

export const getBookSubmissionsByUserId = createAsyncThunk(
  'bookSubmission/getBookSubmissionsByUserId',
  async (userId, thunkAPI) => {
    try {
      const res = await getBookSubmissionsByUserIdAPI(userId);
      return res.data.data;
    } catch (error) {
      console.error(`Error in get book submissions by user id thunk: ${error}`);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue(
        'Get book submissions by user id thunk failed'
      );
    }
  }
);
