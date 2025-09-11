import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  addCourseAPI,
  editCourseAPI,
  deleteCourseAPI,
  getCoursesAPI,
  getCourseByIdAPI,
} from "./coursesAPI";

export const addCourse = createAsyncThunk(
  "/courses/addCourse",
  async (newCourse, thunkAPI) => {
    try {
      const res = await addCourseAPI(newCourse);
      return res.data;
    } catch (error) {
      console.log(`Error in add course thunk: ${error}`);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue(
        "Add course thunk failed due to unknown error"
      );
    }
  }
);

export const editCourse = createAsyncThunk(
  "/courses/editCourse",
  async (updatedCourse, thunkAPI) => {
    try {
      const res = await editCourseAPI(updatedCourse);
      return res.data;
    } catch (error) {
      console.log(`Error in edit course thunk: ${error}`);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue(
        "Edit course thunk failed due to unknown error"
      );
    }
  }
);

export const deleteCourse = createAsyncThunk(
  "/courses/deleteCourse",
  async (id, thunkAPI) => {
    try {
      const res = await deleteCourseAPI(id);
      return res.data;
    } catch (error) {
      console.log(`Error in delete course thunk: ${error}`);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue(
        "Delete course thunk failed due to unknown error"
      );
    }
  }
);

export const getCourses = createAsyncThunk(
  "/courses/getCourses",
  async (_, thunkAPI) => {
    try {
      const res = await getCoursesAPI();

      // sort announcements from newest to oldest
      const sortedData = [...res.data.coursesData].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      return sortedData;
    } catch (error) {
      console.log(`Error in get courses thunk: ${error}`);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue(
        "Get courses thunk failed due to unknown error"
      );
    }
  }
);

export const getCourseById = createAsyncThunk(
  "/courses/getCourseById",
  async (id, thunkAPI) => {
    try {
      const res = await getCourseByIdAPI(id);
      return res.data.courseData;
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
        "Get course by Id thunk failed due to unknown error"
      );
    }
  }
);
