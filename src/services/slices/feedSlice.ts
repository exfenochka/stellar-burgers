import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
};

export const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false
};

export const fetchFeeds = createAsyncThunk(
  'feed/fetch',
  async () => await getFeedsApi()
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state) => {
        state.isLoading = false;
      });
  }
});

export default feedSlice.reducer;

export const selectFeedOrders = (state: { feed: TFeedState }) =>
  state.feed.orders;

export const selectFeedTotal = (state: { feed: TFeedState }) =>
  state.feed.total;

export const selectFeedTotalToday = (state: { feed: TFeedState }) =>
  state.feed.totalToday;

export const selectFeedLoading = (state: { feed: TFeedState }) =>
  state.feed.isLoading;
