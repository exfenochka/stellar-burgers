import { TConstructorIngredient, TIngredient } from '@utils-types';
import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor
} from '../constructorSlice';

jest.mock('uuid', () => ({
  v4: () => 'test-uuid'
}));

const mockBun: TIngredient = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
};

const mockMain: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
};

const mockSauce: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0942',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
};

const mockConstructorMain: TConstructorIngredient = {
  ...mockMain,
  id: 'main-id'
};

const mockConstructorSauce: TConstructorIngredient = {
  ...mockSauce,
  id: 'sauce-id'
};

describe('constructorSlice', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  describe('addIngredient - добавление ингредиента', () => {
    it('Добавляем булочку', () => {
      const state = constructorReducer(initialState, addIngredient(mockBun));

      expect(state.bun).toEqual({
        ...mockBun,
        id: 'test-uuid'
      });
      expect(state.ingredients).toEqual([]);
    });

    it('Замена булки при добавлении другой', () => {
      let state = constructorReducer(initialState, addIngredient(mockBun));
      expect(state.bun?._id).toBe('643d69a5c3f7b9001cfa093c');

      const anotherBun = { ...mockBun, _id: 'another-id' };
      state = constructorReducer(state, addIngredient(anotherBun));
      expect(state.bun?._id).toBe('another-id');
      expect(state.ingredients).toEqual([]);
    });

    it('Добавление начинки', () => {
      const state = constructorReducer(initialState, addIngredient(mockMain));

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toEqual({
        ...mockMain,
        id: 'test-uuid'
      });
    });

    it('Добавление соуса', () => {
      const state = constructorReducer(initialState, addIngredient(mockSauce));

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]).toEqual({
        ...mockSauce,
        id: 'test-uuid'
      });
      expect(state.ingredients[0].type).toBe('sauce');
    });
  });

  describe('removeIngredient - удаление ингредиента', () => {
    it('Удаление ингредиента по id', () => {
      const initialStateWithIngredients = {
        bun: null,
        ingredients: [mockConstructorMain, mockConstructorSauce]
      };

      const state = constructorReducer(
        initialStateWithIngredients,
        removeIngredient('main-id')
      );

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients).toEqual([mockConstructorSauce]);
    });

    it('Если ингредиент с таким id не найден - ничего не удаляется', () => {
      const initialStateWithIngredients = {
        bun: null,
        ingredients: [mockConstructorMain, mockConstructorSauce]
      };

      const state = constructorReducer(
        initialStateWithIngredients,
        removeIngredient('non-existent-id')
      );

      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients).toEqual([
        mockConstructorMain,
        mockConstructorSauce
      ]);
    });
  });

  describe('moveIngredientUp - перемещение ингредиента вверх', () => {
    it('Должен переместить ингредиент вверх', () => {
      const initialStateWithIngredients = {
        bun: null,
        ingredients: [mockConstructorMain, mockConstructorSauce]
      };

      const state = constructorReducer(
        initialStateWithIngredients,
        moveIngredientUp(1)
      );

      expect(state.ingredients).toEqual([
        mockConstructorSauce,
        mockConstructorMain
      ]);
    });

    it('Не перемещается первый элемент вверх', () => {
      const initialStateWithIngredients = {
        bun: null,
        ingredients: [mockConstructorMain, mockConstructorSauce]
      };

      const beforeMove = [...initialStateWithIngredients.ingredients];
      const state = constructorReducer(
        initialStateWithIngredients,
        moveIngredientUp(0)
      );

      expect(state.ingredients).toEqual(beforeMove);
    });

    it('Не перемещать элемент, если индекс вне диапазона', () => {
      const initialStateWithIngredients = {
        bun: null,
        ingredients: [mockConstructorMain, mockConstructorSauce]
      };

      const beforeMove = [...initialStateWithIngredients.ingredients];
      const state = constructorReducer(
        initialStateWithIngredients,
        moveIngredientUp(5)
      );

      expect(state.ingredients).toEqual(beforeMove);
    });
  });

  describe('moveIngredientDown - перемещение ингредиента вниз', () => {
    it('Переместить ингредиент вниз', () => {
      const initialStateWithIngredients = {
        bun: null,
        ingredients: [mockConstructorMain, mockConstructorSauce]
      };

      const state = constructorReducer(
        initialStateWithIngredients,
        moveIngredientDown(0)
      );

      expect(state.ingredients).toEqual([
        mockConstructorSauce,
        mockConstructorMain
      ]);
    });

    it('Не перемещать последний элемент вниз', () => {
      const initialStateWithIngredients = {
        bun: null,
        ingredients: [mockConstructorMain, mockConstructorSauce]
      };

      const beforeMove = [...initialStateWithIngredients.ingredients];
      const state = constructorReducer(
        initialStateWithIngredients,
        moveIngredientDown(1)
      );

      expect(state.ingredients).toEqual(beforeMove);
    });

    it('Не перемещать элемент, если индекс вне диапазона', () => {
      const initialStateWithIngredients = {
        bun: null,
        ingredients: [mockConstructorMain, mockConstructorSauce]
      };

      const beforeMove = [...initialStateWithIngredients.ingredients];
      const state = constructorReducer(
        initialStateWithIngredients,
        moveIngredientDown(5)
      );

      expect(state.ingredients).toEqual(beforeMove);
    });
  });

  describe('clearConstructor - очистка конструктора', () => {
    it('Очистка конструктора (булку и все ингредиенты)', () => {
      let state = constructorReducer(initialState, addIngredient(mockBun));
      state = constructorReducer(state, addIngredient(mockMain));
      state = constructorReducer(state, addIngredient(mockSauce));

      expect(state.bun).not.toBeNull();
      expect(state.ingredients).toHaveLength(2);

      state = constructorReducer(state, clearConstructor());

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(0);
    });

    it('Очистка только конструктора, не влияя на другие части store', () => {
      let state = constructorReducer(initialState, addIngredient(mockBun));
      state = constructorReducer(state, addIngredient(mockMain));

      const stateBeforeClear = { ...state };
      const clearedState = constructorReducer(state, clearConstructor());

      expect(clearedState.bun).toBeNull();
      expect(clearedState.ingredients).toHaveLength(0);
      expect(stateBeforeClear.bun).not.toBeNull();
      expect(stateBeforeClear.ingredients).toHaveLength(1);
    });
  });
});
