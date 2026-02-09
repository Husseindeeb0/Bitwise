import { createSlice } from '@reduxjs/toolkit';
import {
  getAllUsers,
  changeUserRole,
  getUserRegistrations,
} from './userThunks';

const initialState = {
  users: [],
  admins: [],
  registrations: [],
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // getAllUsers
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload?.users;
        state.admins = action.payload?.admins;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.users = null;
        state.admins = null;
      });

    // changeUserRole
    builder
      .addCase(changeUserRole.pending, (state) => {
        state.isAuthenticating = true;
        state.error = null;
      })
      .addCase(changeUserRole.fulfilled, (state, action) => {
        state.isAuthenticating = false;
        state.userData = action.payload;
      })
      .addCase(changeUserRole.rejected, (state, action) => {
        state.isAuthenticating = false;
        state.error = action.payload;
      });

    // getUserRegistrations
    builder
      .addCase(getUserRegistrations.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserRegistrations.fulfilled, (state, action) => {
        state.isLoading = false;
        state.registrations = action.payload;
      })
      .addCase(getUserRegistrations.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
