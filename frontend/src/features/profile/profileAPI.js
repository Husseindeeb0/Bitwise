import { axiosInstance } from '../../lib/axios';

export const getMeAPI = () => axiosInstance.get('/user/me');
export const updateUserAPI = (userData) =>
  axiosInstance.patch('user/updateUser', userData);
