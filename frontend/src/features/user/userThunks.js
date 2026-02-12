import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  changeUserRoleAPI,
  getAllUsersAPI,
  getUserRegistrationsAPI,
} from './userAPI';

export const getAllUsers = createAsyncThunk(
  '/user/getAllUsers',
  async (_, thunkAPI) => {
    try {
      const res = await getAllUsersAPI();
      return res.data.data;
    } catch (error) {
      console.log(`Error in get users thunk: ${error}`);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
    }
  }
);

export const changeUserRole = createAsyncThunk(
  '/user/changeUserRole',
  async ({ userId, newRole }, thunkAPI) => {
    try {
      const res = await changeUserRoleAPI(userId, newRole);
      return res.data;
    } catch (error) {
      console.log(`Error in change user role thunk: ${error}`);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
    }
  }
);

export const getUserRegistrations = createAsyncThunk(
  '/user/getUserRegistrations',
  async (_, thunkAPI) => {
    try {
      const res = await getUserRegistrationsAPI();
      return res.data.data;
    } catch (error) {
      console.log(`Error in get user registrations thunk: ${error}`);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue('Failed to fetch registrations');
    }
  }
);
