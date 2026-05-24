import { FC } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Modal } from '@components';
import { OrderInfo } from '@components';

export const ModalOrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const navigate = useNavigate();

  const handleClose = (): void => {
    navigate(-1);
  };

  const formattedNumber = number
    ? `Детали заказа #${number.padStart(6, '0')}`
    : 'Детали заказа';

  return (
    <Modal title={formattedNumber} onClose={handleClose}>
      <OrderInfo />
    </Modal>
  );
};
