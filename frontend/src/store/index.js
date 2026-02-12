import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import announcementsReducer from '../features/announcements/announcementsSlice';
import coursesReducer from '../features/courses/coursesSlice';
import userReducer from '../features/user/userSlice';
import achievementsReducer from '../features/achievements/achievementsSlice';
import bookFormReducer from '../features/bookForm/bookFormSlice';
import bookSubmissionReducer from '../features/bookSubmission/bookSubSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    announcements: announcementsReducer,
    achievements: achievementsReducer,
    courses: coursesReducer,
    user: userReducer,
    bookForm: bookFormReducer,
    bookSubmission: bookSubmissionReducer,
  },
});
