import React, { FC, useEffect, useState, createContext, useContext, useMemo, useCallback } from 'react';
import { getFirestore, query, collection, where, onSnapshot, addDoc, DocumentReference, DocumentData, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from './auth-context';

export interface Order {
  id: string;
  description: string;
  price: number;
  isPermanent: boolean;
  month?: string;
  isCompleted?: boolean;
}

export interface StoreOrder extends Omit<Order, 'id'> {
  uid: string;
}

interface OrderStore {
  orders: Order[];
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

  useEffect(() => {
    if (user) {
      const { uid } = user;
      const ordersQueryByUserid = query(ordersCollection, where('uid', '==', uid), where('isCompleted', '==', false));

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
  }, [user]);

  const addOrder = useCallback((order: StoreOrder) => addDoc(ordersCollection, order), []);

  const completeOrder = useCallback((id: string) => updateDoc(doc(ordersCollection, id), { isCompleted: true }), []);

  const editOrder = useCallback((id: string, data: Partial<StoreOrder>) => updateDoc(doc(ordersCollection, id), data), []);

  const deleteOrder = useCallback((id: string) => deleteDoc(doc(ordersCollection, id)), []);

  const value: OrderStore = {
    orders,
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
