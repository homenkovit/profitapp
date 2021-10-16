import React, { FC, useEffect, useState } from 'react';
import { useAuth } from '../../contexts/auth-context';
import { Order } from '../../mocks';
import { OrderItem } from '../order-item/order-item';
import { collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import styles from './order-list.module.scss';

export const OrderList: FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (user) {
      const { uid } = user;
      const db = getFirestore();
      const ordersQueryByUserid = query(collection(db, 'orders'), where('uid', '==', uid));

      return onSnapshot(ordersQueryByUserid, (querySnapshot) => {
        setOrders(querySnapshot.docs.map((doc: any) => {
          const { description, isPermanent, month, price } = doc.data();

          return {
            id: doc.id,
            description,
            isPermanent,
            month,
            price,
          };
        }));
      });
    }
  }, [user])

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
