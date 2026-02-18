import { axiosInstance } from '../../lib/axios';

export const downloadTicketAPI = (announcementId) =>
  axiosInstance.get(`/tickets/download/${announcementId}`, {
    responseType: 'blob',
  });
