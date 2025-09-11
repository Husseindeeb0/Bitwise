import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import announcementsReducer from '../features/announcements/announcementsSlice';
import coursesReducer from '../features/courses/coursesSlice';
import userReducer from '../features/user/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    announcements: announcementsReducer,
    courses: coursesReducer,
    user: userReducer,
  },
});
