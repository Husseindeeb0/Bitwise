import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  verifyTokenAPI,
  signupAPI,
  loginAPI,
  logoutAPI,
  refreshTokenAPI,
} from "./authAPI";

export const checkAuth = createAsyncThunk(
  "auth/checkAuth",
  async (_, thunkAPI) => {
    try {
      // First try verifying current access token
      const res = await verifyTokenAPI();
      return res.data.userData;
    } catch (error) {
      // If verify failed, attempt refresh
      if (
        error.response &&
        (error.response.status === 401 || error.response.status === 403)
      ) {
        try {
          const refreshRes = await refreshTokenAPI();
          return refreshRes.data.userData;
        } catch (error) {
          if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          return thunkAPI.rejectWithValue(error.response.data.message);
        }
        return thunkAPI.rejectWithValue("Unknown error in refresh token thunk");
        }
      } else {
        console.log("Error in checkAuth thunk:", error);
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          return thunkAPI.rejectWithValue(error.response.data.message);
        }
        return thunkAPI.rejectWithValue("Unknown error in checkAuth thunk");
      }
    }
  }
);

export const signup = createAsyncThunk(
  "/auth/signup",
  async (userDetails, thunkAPI) => {
    try {
      const res = await signupAPI(userDetails);
      return res.data.userData;
    } catch (error) {
      console.log(`Error in signup thunk: ${error}`);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue(
        "Signup thunk failed due to unknown error"
      );
    }
  }
);

export const login = createAsyncThunk(
  "/auth/login",
  async (userDetails, thunkAPI) => {
    try {
      const res = await loginAPI(userDetails);
      return res.data.userData;
    } catch (error) {
      console.log(`Error in login thunk: ${error}`);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue(
        "Login thunk failed due to unknown error"
      );
    }
  }
);

export const logout = createAsyncThunk("/auth/logout", async (_, thunkAPI) => {
  try {
    const res = await logoutAPI();
    return res.data;
  } catch (error) {
    console.log(`Error in logout thunk: ${error}`);
  }
});
