import React, { FC } from 'react';
import { OrderItem } from '../order-item/order-item';
import styles from './order-list.module.scss';
import { useOrder } from '../../contexts/order-context';

export const OrderList: FC = () => {
  const { orders } = useOrder();

  return (
    <ul className={styles.list}>
      {orders.map((order) => (
        <li key={order.id}>
          <OrderItem data={order} />
        </li>
      ))}
    </ul>
  );
};
