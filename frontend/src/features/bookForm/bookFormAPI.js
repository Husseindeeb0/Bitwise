import { axiosInstance } from '../../lib/axios';

export const createBookFormAPI = (bookFormData) =>
  axiosInstance.post('/bookForm/create', bookFormData);

export const updateBookFormAPI = (bookFormData) =>
  axiosInstance.patch('/bookForm/update', bookFormData);

export const deleteBookFormAPI = (bookFormId) =>
  axiosInstance.delete(`/bookForm/delete/${bookFormId}`);
