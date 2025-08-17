import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  addAnnouncementsAPI,
  editAnnouncementsAPI,
  deleteAnnouncementsAPI,
  getAnnouncementsAPI,
  getAnnouncementsByIdAPI,
  getLatestAnnouncementAPI,
} from "./announcementsAPI";

export const addAnnouncements = createAsyncThunk(
  "/announcements/addAnnouncements",
  async (newAnnouncement, thunkAPI) => {
    try {
      const res = await addAnnouncementsAPI(newAnnouncement);
      return res.data;
    } catch (error) {
      console.log(`Error in add announcements thunk: ${error}`);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue(
        "Add announcements thunk failed due to unknown error"
      );
    }
  }
);

export const editAnnouncements = createAsyncThunk(
  "/announcements/editAnnoundements",
  async (updatedAnnouncement, thunkAPI) => {
    try {
      const res = await editAnnouncementsAPI(updatedAnnouncement);
      return res.data;
    } catch (error) {
      console.log(`Error in edit announcements thunk: ${error}`);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue(
        "Edit announcements thunk failed due to unknown error"
      );
    }
  }
);

export const deleteAnnouncements = createAsyncThunk(
  "/announcements/deleteAnnouncements",
  async (id, thunkAPI) => {
    try {
      const res = await deleteAnnouncementsAPI(id);
      return res.data;
    } catch (error) {
      console.log(`Error in delete announcement thunk: ${error}`);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue(
        "Delete announcement thunk failed due to unknown error"
      );
    }
  }
);

export const getAnnouncements = createAsyncThunk(
  "/announcements/getAnnouncements",
  async (_, thunkAPI) => {
    try {
      const res = await getAnnouncementsAPI();

      // sort announcements from newest to oldest
      const sortedData = [...res.data.announcementsData].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      return sortedData;
    } catch (error) {
      console.log(`Error in get announcements thunk: ${error}`);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue(
        "Get announcements thunk failed due to unknown error"
      );
    }
  }
);

export const getAnnouncementById = createAsyncThunk(
  "/announcements/getAnnouncementsById",
  async (id, thunkAPI) => {
    try {
      const res = await getAnnouncementsByIdAPI(id);
      return res.data;
    } catch (error) {
      console.log(`Error in get announcement by Id thunk: ${error}`);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue(
        "Get announcement by Id thunk failed due to unknown error"
      );
    }
  }
);

export const getLatestAnnouncement = createAsyncThunk(
  "/announcements/getLatestAnnouncement",
  async (_, thunkAPI) => {
    try {
      const res = await getLatestAnnouncementAPI();
      return res.data.announcementData;
    } catch (error) {
      console.log(`Error in get latest announcement thunk: ${error}`);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue(
        "Get latest announcement thunk failed due to unknown error"
      );
    }
  }
);
