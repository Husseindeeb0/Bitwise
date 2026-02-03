import { axiosInstance } from '../../lib/axios';

export const addAchievementsAPI = (newAchievement) =>
  axiosInstance.post('/achievements/addAchievements', {
    newAchievements: newAchievement,
  });

export const editAchievementsAPI = ({ id, achievementData }) =>
  axiosInstance.post('/achievements/editAchievements', {
    updatedAchievement: { ...achievementData, _id: id },
  });
export const deleteAchievementsAPI = (id) =>
  axiosInstance.delete(`/achievements/deleteAchievements/${id}`);
export const getAchievementsAPI = () =>
  axiosInstance.get('/achievements/getAchievements');
export const getAchievementByIdAPI = (id) =>
  axiosInstance.get(`/achievements/getAchievementById/${id}`);
export const getLatestAchievementAPI = () =>
  axiosInstance.get('/achievements/getLatestAchievement');
