import feedReducer, {
  fetchFeeds,
  selectFeedTotal,
  selectFeedLoading,
  selectFeedTotalToday
} from '../feedSlice';
import { TOrder } from '@utils-types';

const mockOrders: TOrder[] = [
  {
    _id: '1',
    status: 'done',
    name: 'Тестовый заказ 1',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    number: 12345,
    ingredients: ['ingredient1', 'ingredient2']
  },
  {
    _id: '2',
    status: 'pending',
    name: 'Тестовый заказ 2',
    createdAt: '2026-01-02T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z',
    number: 12346,
    ingredients: ['ingredient3', 'ingredient4']
  }
];

const mockApiResponse = {
  success: true,
  orders: mockOrders,
  total: 100,
  totalToday: 5
};

describe('feedSlice - тестирование слайса ленты заказов', () => {
  const initialState = {
    orders: [],
    total: 0,
    totalToday: 0,
    isLoading: false
  };

  describe('Асинхронный запрос', () => {
    it('Должен установить isLoading в true', () => {
      const state = feedReducer(undefined, fetchFeeds.pending('', undefined));

      expect(state).toEqual({
        orders: [],
        total: 0,
        totalToday: 0,
        isLoading: true
      });
    });

    it('Должен сохранить заказы и отключить isLoading', () => {
      const state = feedReducer(
        undefined,
        fetchFeeds.fulfilled(mockApiResponse, '', undefined)
      );

      expect(state).toEqual({
        orders: mockOrders,
        total: 100,
        totalToday: 5,
        isLoading: false
      });
    });

    it('Установливается isLoading в false - данные не меняются', () => {
      const state = feedReducer(
        undefined,
        fetchFeeds.rejected(new Error('Ошибка'), '', undefined)
      );

      expect(state).toEqual({
        orders: [],
        total: 0,
        totalToday: 0,
        isLoading: false
      });
    });
  });

  describe('Селекторы', () => {
    const state = {
      feed: {
        orders: mockOrders,
        total: 100,
        totalToday: 5,
        isLoading: false
      }
    };

    it('selectFeedTotal должен возвращать общее количество заказов', () => {
      expect(selectFeedTotal(state)).toBe(100);
    });

    it('selectFeedTotalToday должен возвращать количество заказов за сегодня', () => {
      expect(selectFeedTotalToday(state)).toBe(5);
    });

    it('selectFeedLoading должен возвращать статус загрузки', () => {
      expect(selectFeedLoading(state)).toBe(false);
    });

    it('selectFeedLoading должен возвращать true при загрузке', () => {
      const loadingState = {
        feed: {
          orders: [],
          total: 0,
          totalToday: 0,
          isLoading: true
        }
      };
      expect(selectFeedLoading(loadingState)).toBe(true);
    });
  });
});
