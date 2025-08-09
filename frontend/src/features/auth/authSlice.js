import { createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";

const initialState = {
  loggingIn: false,
  signingIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    checkAuth: async () => {
      try {
        // First try verifying current access token
        const res = await axiosInstance.get("/auth/verifyJWT");
      } catch (error) {
        // If verify failed, attempt refresh
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          try {
            const refreshRes = await axiosInstance.get("/auth/refreshToken");
            set({ authUser: refreshRes.data });
          } catch (refreshErr) {
            console.log("Refresh failed:", refreshErr);
          }
        } else {
          console.log("Error in checkAuth:", error);
        }
      }
    },
    login: async (userDetails) => {
      loggingIn = true;
      try {
        const res = await axiosInstance.post("/user/getAllUsers", data);
        return res.data;
      } catch (error) {
        console.log(
          `Error logging in: ${error.data.message}` || "Logging in failed"
        );
      }
      loggingIn = false;
    },
    signup: async () => {
      signingIn = true;
      try {
        const res = await axiosInstance.post("/auth/signup", data);
        return res.data;
      } catch (error) {
        console.log(
          `Error signing in: ${error.data.message}` || "Signing in failed"
        );
      }
      signingIn = false;
    },
    logout: async () => {
      try {
        const res = await axiosInstance.post("/auth/logout", data);
        return res.data;
      } catch (error) {
        console.log(
          `Error logging out: ${error.data.message}` || "Logging out failed"
        );
      }
    },
  },
});

export const { login, signup, logout, checkAuth } = authSlice.actions;
export default authSlice.reducer;
