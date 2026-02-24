import { createSlice } from '@reduxjs/toolkit';
import { downloadTicket } from './ticketThunks';

const initialState = {
  isLoading: false,
  error: null,
  success: false,
};

const ticketSlice = createSlice({
  name: 'ticket',
  initialState,
  reducers: {
    resetTicketState: (state) => {
      state.isLoading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(downloadTicket.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(downloadTicket.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
        state.error = null;
      })
      .addCase(downloadTicket.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.success = false;
      });
  },
});

export const { resetTicketState } = ticketSlice.actions;
export default ticketSlice.reducer;
