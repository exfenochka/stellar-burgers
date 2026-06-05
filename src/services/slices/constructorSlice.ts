import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '../../utils/types';
import { v4 as uuid } from 'uuid';

type TConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

export const initialState: TConstructorState = { bun: null, ingredients: [] };

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: uuid() }
      })
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (i) => i.id !== action.payload
      );
    },
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const i = action.payload;
      if (i > 0) {
        [state.ingredients[i], state.ingredients[i - 1]] = [
          state.ingredients[i - 1],
          state.ingredients[i]
        ];
      }
    },
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const i = action.payload;
      if (i < state.ingredients.length - 1) {
        [state.ingredients[i], state.ingredients[i + 1]] = [
          state.ingredients[i + 1],
          state.ingredients[i]
        ];
      }
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor
} = constructorSlice.actions;

export default constructorSlice.reducer;

export const selectConstructorItems = (state: {
  burgerConstructor: TConstructorState;
}) => state.burgerConstructor;
