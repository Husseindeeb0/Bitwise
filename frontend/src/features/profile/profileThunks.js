import { createAsyncThunk } from '@reduxjs/toolkit';
import { getMeAPI, updateUserAPI } from './profileAPI';

export const getMe = createAsyncThunk('/user/getMe', async (_, thunkAPI) => {
  try {
    const res = await getMeAPI();
    return res.data.data;
  } catch (error) {
    console.log(`Error in get user thunk: ${error}`);
    if (error.response && error.response.data && error.response.data.message) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
    return thunkAPI.rejectWithValue('Failed to fetch user');
  }
});

export const updateUser = createAsyncThunk(
  'profile/updateUser',
  async (userData, thunkAPI) => {
    try {
      const res = await updateUserAPI(userData);
      return res.data.data;
    } catch (error) {
      console.log(`Error in update user thunk: ${error}`);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue('Failed to update user');
    }
  }
);
