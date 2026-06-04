import { rootReducer } from '../../store';
import { initialState as ingredientsInitialState } from '../ingredientsSlice';
import { initialState as constructorInitialState } from '../constructorSlice';
import { initialState as feedInitialState } from '../feedSlice';
import { initialState as userInitialState } from '../userSlice';
import { initialState as orderInitialState } from '../orderSlice';
import { initialState as userOrdersInitialState } from '../userOrdersSlice';

describe('rootReducer', () => {
  it('Должен возвращать корректное начальное состояние при неизвестном экшене', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const state = rootReducer(undefined, action);

    expect(state).toEqual({
      ingredients: ingredientsInitialState,
      burgerConstructor: constructorInitialState,
      feed: feedInitialState,
      user: userInitialState,
      order: orderInitialState,
      userOrders: userOrdersInitialState
    });
  });
});
