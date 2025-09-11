import { createSlice } from "@reduxjs/toolkit";
import {
  addCourse,
  deleteCourse,
  editCourse,
  getCourses,
  getCourseById,
} from "./coursesThunks";

const initialState = {
  coursesData: [],
  courseById: null,
  isLoading: false,
  error: null,
};

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // addCourses
    builder
      .addCase(addCourse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addCourse.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(addCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // editCourses
    builder
      .addCase(editCourse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(editCourse.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(editCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // deleteCourses
    builder
      .addCase(deleteCourse.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.isLoading = false;
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // getCourses
    builder
      .addCase(getCourses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.coursesData = action.payload;
      })
      .addCase(getCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // getCourseById
    builder
      .addCase(getCourseById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCourseById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.courseById = action.payload;
      })
      .addCase(getCourseById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const coursesActions = coursesSlice.actions;
export default coursesSlice.reducer;
