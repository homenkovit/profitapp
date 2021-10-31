import React, { FC, useEffect, useState, createContext, useContext, useMemo, useCallback } from 'react';
import { getFirestore, query, collection, where, onSnapshot, addDoc, DocumentReference, DocumentData, deleteDoc, doc, updateDoc, deleteField, serverTimestamp, Timestamp, orderBy } from 'firebase/firestore';
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
  sortedOrders: Order[];
  currentYearCompletedOrders: Order[];
  sortOrders: (sortType: SortType) => void;
  addOrder: (order: StoreOrder) => Promise<DocumentReference<DocumentData>>;
  completeOrder: (id: string) => Promise<void>;
  editOrder: (id: string, data: Partial<StoreOrder>) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
}

export enum SortType {
  DATE_DESC = 'DATE_DESC',
  DATE_ASC = 'DATE_ASC',
  PRICE_DESC = 'PRICE_DESC',
  PRICE_ASC = 'PRICE_ASC',
  PERMANENT = 'PERMANENT',
  ONCE = 'ONCE',
}

export const LOCAL_STORAGE_SORT_KEY = 'sortType';
const DEFAULT_SORT_TYPE = SortType.DATE_DESC;

export const sortTypeToText = (sortType: SortType): string => {
  switch(sortType) {
    case SortType.DATE_ASC:
      return 'дате ↑';
    case SortType.DATE_DESC:
      return 'дате ↓';
    case SortType.PRICE_ASC:
      return 'цене ↑';
    case SortType.PRICE_DESC:
      return 'цене ↓';
    case SortType.PERMANENT:
      return 'постоянные';
    case SortType.ONCE:
      return 'разовые';
    default: throw new Error(`Can't find sort type ${sortType}`);
  }
};

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
  const [sortedOrders, setSortedOrders] = useState<Order[]>([]);
  const [currentYearCompletedOrders, setCurrentYearCompletedOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!localStorage.getItem(LOCAL_STORAGE_SORT_KEY)) {
      localStorage.setItem(LOCAL_STORAGE_SORT_KEY, DEFAULT_SORT_TYPE);
    }
  }, []);

  useEffect(() => {
    const sortType = localStorage.getItem(LOCAL_STORAGE_SORT_KEY);
    if (sortType) {
      sortOrders(sortType as SortType);
    }
  }, [orders]);

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

  const sortOrders = (sortType: SortType) => {
    localStorage.setItem(LOCAL_STORAGE_SORT_KEY, sortType);
    switch(sortType) {
      case SortType.DATE_ASC:
        setSortedOrders([...orders].sort((prev, next) => Number(prev.createdAt) - Number(next.createdAt)));
        break;
      case SortType.DATE_DESC:
        setSortedOrders([...orders].sort((prev, next) => Number(next.createdAt) - Number(prev.createdAt)));
        break;
      case SortType.PRICE_ASC:
        setSortedOrders([...orders].sort((prev, next) => prev.price - next.price));
        break;
      case SortType.PRICE_DESC:
        setSortedOrders([...orders].sort((prev, next) => next.price - prev.price));
        break;
      case SortType.PERMANENT:
        setSortedOrders([...orders].sort((prev, next) => {
          if(prev.isPermanent > next.isPermanent) { return -1 }
          if(prev.isPermanent < next.isPermanent) { return 1 }
          return 0;
        }));
        break;
      case SortType.ONCE:
        setSortedOrders([...orders].sort((prev, next) => {
          if(prev.isPermanent < next.isPermanent) { return -1 }
          if(prev.isPermanent > next.isPermanent) { return 1 }
          return 0;
        }));
        break;
      default: console.error(`Sort type ${sortType} not implemented`);
    }
  };

  const value: OrderStore = {
    orders,
    sortedOrders,
    currentYearCompletedOrders,
    sortOrders,
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
