import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

type TUserOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
};

const initialState: TUserOrdersState = {
  orders: [],
  isLoading: false
};

export const fetchUserOrders = createAsyncThunk(
  'userOrders/fetch',
  async () => await getOrdersApi()
);

const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state) => {
        state.isLoading = false;
      });
  }
});

export default userOrdersSlice.reducer;

export const selectUserOrders = (state: { userOrders: TUserOrdersState }) =>
  state.userOrders.orders;

export const selectUserOrdersLoading = (state: {
  userOrders: TUserOrdersState;
}) => state.userOrders.isLoading;
