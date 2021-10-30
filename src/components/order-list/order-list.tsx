import React, { FC, useState, useEffect } from 'react';
import { OrderItem } from '../order-item/order-item';
import styles from './order-list.module.scss';
import { useOrder } from '../../contexts/order-context';
import { SortType } from '../sort-bar/sort-bar';

interface OrderListProps {
  sortType: SortType,
}

export const OrderList: FC<OrderListProps> = (props) => {
  const { orders } = useOrder();

  switch(props.sortType) {
    case SortType.DATE: 
      console.log('in progress');
      break;
    case SortType.ASC_PRICE: 
      orders.sort((prev, next) => prev.price - next.price);
      break;
    case SortType.DESC_PRICE:
      orders.sort((prev, next) => next.price - prev.price);
      break;
    case SortType.PERMANENT:
      orders.sort((prev, next) => {
        if(prev.isPermanent > next.isPermanent) { return -1 }
        if(prev.isPermanent < next.isPermanent) { return 1 }
        return 0;
      });
      break;
    case SortType.ONCE:
      orders.sort((prev, next) => {
        if(prev.isPermanent < next.isPermanent) { return -1 }
        if(prev.isPermanent > next.isPermanent) { return 1 }
        return 0;
      });
      break;
    default: console.error(`Sort type ${props.sortType} not implemented`);
  }

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
