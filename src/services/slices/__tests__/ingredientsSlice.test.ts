import { TIngredient } from '@utils-types';
import ingredientsReducer, { fetchIngredients } from '../ingredientsSlice';

const mockIngredients: TIngredient[] = [
  {
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
  },
  {
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
  }
];

describe('ingredientsSlice - тестирование слайса ингредиентов', () => {
  describe('Асинхронный запрос', () => {
    it('Флаг загрузки true', () => {
      const state = ingredientsReducer(
        undefined,
        fetchIngredients.pending('', undefined)
      );

      expect(state).toEqual({
        ingredients: [],
        isLoading: true,
        error: null
      });
    });

    it('Должен сохранить ингредиенты и отключить флаг загрузки', () => {
      const state = ingredientsReducer(
        undefined,
        fetchIngredients.fulfilled(mockIngredients, '', undefined)
      );

      expect(state).toEqual({
        ingredients: mockIngredients,
        isLoading: false,
        error: null
      });
    });

    it('Должен сохранить ошибку и отключить флаг загрузки', () => {
      const state = ingredientsReducer(
        undefined,
        fetchIngredients.rejected(new Error('Request failed'), '', undefined)
      );

      expect(state).toEqual({
        ingredients: [],
        isLoading: false,
        error: 'Request failed'
      });
    });
  });
});
