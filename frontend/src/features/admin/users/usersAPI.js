import { axiosInstance } from '../../../lib/axios';

export const getAllUsersAPI = () => axiosInstance.get('/user/getAllUsers');
export const changeUserRoleAPI = (userId, newRole) =>
  axiosInstance.patch('/user/changeUserRole', { userId, newRole });
