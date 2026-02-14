import { axiosInstance } from '../../lib/axios';

export const getMeAPI = () => axiosInstance.get('/user/me');
