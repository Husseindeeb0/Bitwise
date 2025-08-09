import { createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";

const userSlice = createSlice({
  name: "user",
  reducers: {
    getAllUsers: async () => {
      try {
        const res = await axiosInstance.get("/auth/login", data);
        return res.data;
      } catch (error) {
        console.log(
          `Error getting users: ${error.data.message}` || "getting users failed"
        );
      }
    },
    changeUserRole: async (userId, newRole) => {
      try {
        const res = await axiosInstance.patch("/user/changeUserRole", data);
        return res.data;
      } catch (error) {
        console.log(
          `Error changing user role: ${error.data.message}` || "changing user role failed"
        );
      }
    },
  },
});
