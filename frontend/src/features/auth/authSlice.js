import { createSlice } from "@reduxjs/toolkit";
import { checkAuth, signup, login, logout } from "./authThunks";

const initialState = {
  userData: null,
  isAuthenticating: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // checkAuth
    builder
      .addCase(checkAuth.pending, (state) => {
        state.isAuthenticating = true;
        state.error = null;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isAuthenticating = false;
        state.userData = action.payload;
      })
      .addCase(checkAuth.rejected, (state, action) => {
        state.isAuthenticating = false;
        state.error = action.payload;
        state.userData = null;
      });

    // signup
    builder
      .addCase(signup.pending, (state) => {
        state.isAuthenticating = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.isAuthenticating = false;
        state.userData = action.payload;
      })
      .addCase(signup.rejected, (state, action) => {
        state.isAuthenticating = false;
        state.error = action.payload;
      });

    // login
    builder
      .addCase(login.pending, (state) => {
        state.isAuthenticating = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticating = false;
        state.userData = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isAuthenticating = false;
        state.error = action.payload;
      });

    // logout
    builder
      .addCase(logout.pending, (state) => {
        state.isAuthenticating = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticating = false;
        state.userData = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isAuthenticating = false;
        state.error = action.payload;
      });
  },
});
export const authActions = authSlice.actions;
export default authSlice.reducer;
