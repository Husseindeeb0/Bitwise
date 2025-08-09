import { createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";

const announcementsSlice = createSlice({
  name: "announcements",
  reducers: {
    addAnnouncements: async (newAnnouncement) => {
      try {
        const res = await axiosInstance.post("/auth/addAnnouncements", data);
        return res.data;
      } catch (error) {
        console.log(
          `Error adding announcements: ${error.data.message}` ||
            "Error adding announcements"
        );
      }
    },
    editAnnouncements: async (updatedAnnouncement) => {
      try {
        const res = await axiosInstance.patch("/auth/editAnnouncements", data);
        return res.data;
      } catch (error) {
        console.log(
          `Error editing announcements: ${error.data.message}` ||
            "Error editing announcements"
        );
      }
    },
    deleteAnnouncements: async (id) => {
      try {
        const res = await axiosInstance.delete(
          "/auth/deleteAnnouncements",
          data
        );
        return res.data;
      } catch (error) {
        console.log(
          `Error deleting announcements: ${error.data.message}` ||
            "Error deleting announcements"
        );
      }
    },
    getAnnouncements: async () => {
      try {
        const res = await axiosInstance.get("/auth/getAnnouncements", data);
        return res.data;
      } catch (error) {
        console.log(
          `Error getting announcements: ${error.data.message}` ||
            "Error getting announcements"
        );
      }
    },
    getAnnouncementById: async (id) => {
      try {
        const res = await axiosInstance.get("/auth/getAnnouncementById", data);
        return res.data;
      } catch (error) {
        console.log(
          `Error getting announcement by Id: ${error.data.message}` ||
            "Error getting announcement by Id"
        );
      }
    },
    getLatestAnnouncement: async () => {
      try {
        const res = await axiosInstance.get("/auth/getLatestAnnouncement", data);
        return res.data;
      } catch (error) {
        console.log(
          `Error getting latest announcement: ${error.data.message}` ||
            "Error getting latest announcement"
        );
      }
    },
  },
});

export default announcementsSlice.reducer;
