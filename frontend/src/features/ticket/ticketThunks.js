import { createAsyncThunk } from '@reduxjs/toolkit';
import { downloadTicketAPI, validateTicketAPI } from './ticketAPI';

export const downloadTicket = createAsyncThunk(
  'ticket/download',
  async (announcementId, thunkAPI) => {
    try {
      const response = await downloadTicketAPI(announcementId);

      const contentDisposition = response.headers['content-disposition'];
      let fileName = `ticket-${announcementId}.pdf`;

      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename=(.+)/);
        if (fileNameMatch && fileNameMatch.length > 1) {
          fileName = fileNameMatch[1].replace(/['"]/g, '');
        }
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error('Error in downloadTicket thunk:', error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        return thunkAPI.rejectWithValue(error.response.data.message);
      }
      return thunkAPI.rejectWithValue('Failed to download ticket');
    }
  }
);

export const validateTicket = createAsyncThunk(
  'ticket/validate',
  async (ticketData, thunkAPI) => {
    try {
      const response = await validateTicketAPI(ticketData);
      return response.data;
    } catch (error) {
      if (error.response && error.response.data) {
        return thunkAPI.rejectWithValue(error.response.data);
      }
      return thunkAPI.rejectWithValue({ message: 'Validation failed' });
    }
  }
);
