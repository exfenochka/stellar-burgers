import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrderByNumberApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

type TOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null; // Только для модалки после ОФОРМЛЕНИЯ заказа
  orderInfoData: TOrder | null; // Только для просмотра заказа по НОМЕРУ (кэш)
};

export const initialState: TOrderState = {
  orderRequest: false,
  orderModalData: null,
  orderInfoData: null
};

export const createOrder = createAsyncThunk(
  'order/create',
  async (ingredients: string[]) => {
    const data = await orderBurgerApi(ingredients);
    return data.order as unknown as TOrder;
  }
);

export const getOrderByNumber = createAsyncThunk(
  'order/getByNumber',
  async (number: number) => {
    const data = await getOrderByNumberApi(number);
    return data.orders[0];
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    // Очистка модалки успешного заказа
    clearOrderModalData: (state) => {
      state.orderModalData = null;
    },
    // Очистка кэша просматриваемого заказа
    clearOrderInfoData: (state) => {
      state.orderInfoData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state) => {
        state.orderRequest = false;
      })

      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.orderInfoData = action.payload;
      });
  }
});

export const { clearOrderModalData, clearOrderInfoData } = orderSlice.actions;
export default orderSlice.reducer;

export const selectOrderRequest = (state: { order: TOrderState }) =>
  state.order.orderRequest;

export const selectOrderModalData = (state: { order: TOrderState }) =>
  state.order.orderModalData;

export const selectOrderInfoData = (state: { order: TOrderState }) =>
  state.order.orderInfoData;
