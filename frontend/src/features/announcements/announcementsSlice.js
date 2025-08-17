import { createSlice } from "@reduxjs/toolkit";
import {
  addAnnouncements,
  deleteAnnouncements,
  editAnnouncements,
  getAnnouncementById,
  getAnnouncements,
  getLatestAnnouncement,
} from "./announcementsThunks";

const initialState = {
  announcementsData: null,
  latestAnnouncement: null,
  announcementById: null,
  isLoading: false,
  error: null,
};

const announcementsSlice = createSlice({
  name: "announcements",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // addAnnouncements
    builder
      .addCase(addAnnouncements.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addAnnouncements.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(addAnnouncements.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // editAnnouncements
    builder
      .addCase(editAnnouncements.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(editAnnouncements.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(editAnnouncements.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // deleteAnnouncements
    builder
      .addCase(deleteAnnouncements.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAnnouncements.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(deleteAnnouncements.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // getAnnouncements
    builder
      .addCase(getAnnouncements.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAnnouncements.fulfilled, (state, action) => {
        state.isLoading = false;
        state.announcementsData = action.payload;
      })
      .addCase(getAnnouncements.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // getAnnouncementById
    builder
      .addCase(getAnnouncementById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAnnouncementById.fulfilled, (state) => {
        state.isLoading = false;
        state.announcementById = action.payload;
      })
      .addCase(getAnnouncementById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // getLatestAnnouncement
    builder
      .addCase(getLatestAnnouncement.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getLatestAnnouncement.fulfilled, (state, action) => {
        state.isLoading = false;
        state.latestAnnouncement = action.payload;
      })
      .addCase(getLatestAnnouncement.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const announcementsActions = announcementsSlice.actions;
export default announcementsSlice.reducer;
