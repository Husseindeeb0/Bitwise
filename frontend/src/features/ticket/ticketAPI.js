import { axiosInstance } from '../../lib/axios';

export const downloadTicketAPI = (announcementId) =>
  axiosInstance.get(`/tickets/download/${announcementId}`, {
    responseType: 'blob',
  });

export const validateTicketAPI = (data) =>
  axiosInstance.post('/tickets/validate', data);
