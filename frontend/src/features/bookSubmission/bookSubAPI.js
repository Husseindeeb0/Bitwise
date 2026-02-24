import { axiosInstance } from '../../lib/axios';

export const submitBookSubmissionAPI = (submissionData) =>
  axiosInstance.post('/bookSub/submit', submissionData);

export const deleteBookSubmissionAPI = (bookSubmissionId) =>
  axiosInstance.delete(`/bookSub/delete/${bookSubmissionId}`);

export const getBookSubmissionsAPI = (announcementId) =>
  axiosInstance.get(`/bookSub/getSubmissions/${announcementId}`);

export const getBookSubmissionsByUserIdAPI = () =>
  axiosInstance.get(`/bookSub/getSubmissionsByUserId`);
