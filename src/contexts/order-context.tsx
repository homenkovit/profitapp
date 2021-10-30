import React, { FC, useEffect, useState, createContext, useContext, useMemo, useCallback } from 'react';
import { getFirestore, query, collection, where, onSnapshot, addDoc, DocumentReference, DocumentData, deleteDoc, doc, updateDoc, deleteField, serverTimestamp, Timestamp } from 'firebase/firestore';
import { useAuth } from './auth-context';
import { MONTHS } from '../utils';

export interface Order {
  id: string;
  description: string;
  price: number;
  isPermanent: boolean;
  year?: number;
  month?: number;
  isCompleted?: boolean;
  completedYear?: number;
  completedMonth?: number;
  createdAt: Timestamp | null;
  updatedAt?: Timestamp | null;
}

export interface StoreOrder extends Omit<Order, 'id'> {
  uid: string;
}

interface OrderStore {
  orders: Order[];
  currentYearCompletedOrders: Order[];
  addOrder: (order: StoreOrder) => Promise<DocumentReference<DocumentData>>;
  completeOrder: (id: string) => Promise<void>;
  editOrder: (id: string, data: Partial<StoreOrder>) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
}

const OrderContext = createContext<OrderStore | null>(null);

export const useOrder = (): OrderStore => {
  const store = useContext(OrderContext);

  if (!store) {
    throw new Error('Order store isn\'t initialized yet');
  }

  return store;
}

export const OrderProvider: FC = ({ children }) => {
  const { user } = useAuth();
  const db = useMemo(() => getFirestore(), []);
  const ordersCollection = useMemo(() => collection(db, 'orders'), [db]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentYearCompletedOrders, setCurrentYearCompletedOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (user) {
      const { uid } = user;
      const ordersQuery = query(ordersCollection, where('uid', '==', uid), where('isCompleted', '==', false));

      return onSnapshot(ordersQuery, (querySnapshot) => {
        setOrders(querySnapshot.docs.map((doc) => {
          const { description, isPermanent, year, month, price, createdAt, updatedAt } = doc.data() as StoreOrder;

          return {
            id: doc.id,
            description,
            isPermanent,
            year,
            month,
            price,
            createdAt,
            updatedAt,
          };
        }));
      });
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const { uid } = user;
      const ordersQuery = query(
        ordersCollection,
        where('uid', '==', uid),
        where('isCompleted', '==', true),
        where('completedYear', '==', new Date().getFullYear()),
      );

      return onSnapshot(ordersQuery, (querySnapshot) => {
        setCurrentYearCompletedOrders(querySnapshot.docs.map((doc) => {
          const { description, isPermanent, year, month, price, isCompleted, createdAt, updatedAt, completedYear, completedMonth } = doc.data() as StoreOrder;

          return {
            id: doc.id,
            description,
            isPermanent,
            year,
            month,
            price,
            isCompleted,
            completedYear,
            completedMonth,
            createdAt,
            updatedAt,
          };
        }));
      });
    }
  }, [user]);

  const addOrder = useCallback((order: StoreOrder) => addDoc(ordersCollection, { ...order, createdAt: serverTimestamp() }), []);

  const completeOrder = useCallback((id: string) => updateDoc(
    doc(ordersCollection, id),
    {
      isCompleted: true,
      updatedAt: serverTimestamp(),
      completedYear: new Date().getFullYear(),
      completedMonth: MONTHS[new Date().getMonth()],
    },
  ), []);

  const editOrder = useCallback((id: string, data: Partial<StoreOrder>) => {
    let permanentOptions;
    if (data.isPermanent) {
      permanentOptions = {
        year: deleteField(),
        month: deleteField(),
      }
    }
    return updateDoc(doc(ordersCollection, id), { ...data, ...permanentOptions, updatedAt: serverTimestamp() });
  }, []);

  const deleteOrder = useCallback((id: string) => deleteDoc(doc(ordersCollection, id)), []);

  const value: OrderStore = {
    orders,
    currentYearCompletedOrders,
    addOrder,
    completeOrder,
    editOrder,
    deleteOrder,
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};
