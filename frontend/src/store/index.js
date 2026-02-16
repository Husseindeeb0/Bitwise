import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import announcementsReducer from '../features/announcements/announcementsSlice';
import coursesReducer from '../features/courses/coursesSlice';
import userReducer from '../features/admin/users/usersSlice';
import achievementsReducer from '../features/achievements/achievementsSlice';
import bookFormReducer from '../features/bookForm/bookFormSlice';
import bookSubmissionReducer from '../features/bookSubmission/bookSubSlice';
import profileReducer from '../features/profile/profileSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    announcements: announcementsReducer,
    achievements: achievementsReducer,
    courses: coursesReducer,
    user: userReducer,
    bookForm: bookFormReducer,
    bookSubmission: bookSubmissionReducer,
    profile: profileReducer,
  },
});
