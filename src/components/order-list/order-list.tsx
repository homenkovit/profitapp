import React, { FC } from 'react';
import { OrderItem } from '../order-item/order-item';
import styles from './order-list.module.scss';
import { useOrder } from '../../contexts/order-context';

export const OrderList: FC = () => {
  const { sortedOrders } = useOrder();

  return (
    <ul className={styles.list}>
      {sortedOrders.map((order) => (
        <li key={order.id}>
          <OrderItem data={order} />
        </li>
      ))}
    </ul>
  );
};
