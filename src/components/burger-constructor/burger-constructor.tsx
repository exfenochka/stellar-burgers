import { FC, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { selectConstructorItems } from '../../services/slices/constructorSlice';
import { clearConstructor } from '../../services/slices/constructorSlice';
import { selectUser } from '../../services/slices/userSlice';
import {
  createOrder,
  clearOrderModalData,
  selectOrderRequest,
  selectOrderModalData
} from '../../services/slices/orderSlice';

export const BurgerConstructor: FC = () => {
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const constructorItems = useSelector(selectConstructorItems);
  const user = useSelector(selectUser);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(
    () => () => {
      dispatch(clearConstructor());
    },
    [dispatch]
  );

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!user) {
      navigate('/login', { state: { from: location } });
      return;
    }

    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((i) => i._id),
      constructorItems.bun._id
    ];

    dispatch(createOrder(ingredientIds))
      .unwrap()
      .then(() => {
        dispatch(clearConstructor());
      })
      .catch(() => {});
  };

  const closeOrderModal = () => {
    dispatch(clearOrderModalData());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
