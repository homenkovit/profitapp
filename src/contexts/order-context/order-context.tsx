/* eslint-disable max-lines */
import { FC, useEffect, useState, createContext, useContext, useMemo, useCallback } from 'react'
import {
  getFirestore,
  query,
  collection,
  where,
  onSnapshot,
  addDoc,
  DocumentReference,
  DocumentData,
  deleteDoc,
  doc,
  updateDoc,
  deleteField,
  serverTimestamp,
} from 'firebase/firestore'

import { useAuth } from 'contexts/auth-context'
import { useSortedOrders } from 'hooks/use-sorted-orders'
import type { SortOrders } from 'hooks/use-sorted-orders'

import type { Order, StoreOrder } from './types'

interface OrderStore {
  orders: Order[]
  sortedOrders: Order[]
  currentYearCompletedOrders: Order[]
  sortOrders: (sortType: SortOrders) => void
  addOrder: (order: StoreOrder) => Promise<DocumentReference<DocumentData>>
  completeOrder: (id: string) => Promise<void>
  editOrder: (id: string, data: Partial<StoreOrder>) => Promise<void>
  deleteOrder: (id: string) => Promise<void>
}

const OrderContext = createContext<OrderStore | null>(null)

export const useOrder = (): OrderStore => {
  const store = useContext(OrderContext)

  if (!store) {
    throw new Error("Order store isn't initialized yet")
  }

  return store
}

export const OrderProvider: FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()

  const database = useMemo(() => getFirestore(), [])
  const ordersCollection = useMemo(() => collection(database, 'orders'), [database])

  const [orders, setOrders] = useState<Order[]>([])
  const [currentYearCompletedOrders, setCurrentYearCompletedOrders] = useState<Order[]>([])

  const { sortedOrders, sortOrders } = useSortedOrders(orders)

  useEffect(() => {
    if (!user) return undefined

    const { uid } = user
    const ordersQuery = query(
      ordersCollection,
      where('uid', '==', uid),
      where('isCompleted', '==', true),
      where('completedYear', '==', new Date().getFullYear()),
    )

    return onSnapshot(ordersQuery, (querySnapshot) => {
      setCurrentYearCompletedOrders(
        querySnapshot.docs.map((document_) => {
          const {
            description,
            isPermanent,
            year,
            month,
            price,
            isCompleted,
            createdAt,
            updatedAt,
            completedYear,
            completedMonth,
          } = document_.data() as StoreOrder

          return {
            id: document_.id,
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
          }
        }),
      )
    })
  }, [ordersCollection, user])

  useEffect(() => {
    if (!user) return undefined

    const { uid } = user
    const ordersQuery = query(ordersCollection, where('uid', '==', uid), where('isCompleted', '==', false))

    return onSnapshot(ordersQuery, (querySnapshot) => {
      setOrders(
        querySnapshot.docs.map((document_) => {
          const {
            description,
            isPermanent,
            year,
            month,
            isOverdue,
            originalYear,
            originalMonth,
            price,
            createdAt,
            updatedAt,
          } = document_.data() as StoreOrder

          return {
            id: document_.id,
            description,
            isPermanent,
            year,
            month,
            isOverdue,
            originalYear,
            originalMonth,
            price,
            createdAt,
            updatedAt,
          }
        }),
      )
    })
  }, [ordersCollection, user])

  const addOrder = useCallback(
    (order: StoreOrder) => addDoc(ordersCollection, { ...order, createdAt: serverTimestamp() }),
    [ordersCollection],
  )

  const completeOrder = useCallback(
    (id: string) =>
      updateDoc(doc(ordersCollection, id), {
        isCompleted: true,
        updatedAt: serverTimestamp(),
        completedYear: new Date().getFullYear(),
        completedMonth: new Date().getMonth(),
      }),
    [ordersCollection],
  )

  const editOrder = useCallback(
    (id: string, data: Partial<StoreOrder>) => {
      let permanentOptions
      if (data.isPermanent) {
        permanentOptions = {
          year: deleteField(),
          month: deleteField(),
        }
      }
      return updateDoc(doc(ordersCollection, id), { ...data, ...permanentOptions, updatedAt: serverTimestamp() })
    },
    [ordersCollection],
  )

  const deleteOrder = useCallback((id: string) => deleteDoc(doc(ordersCollection, id)), [ordersCollection])

  useEffect(() => {
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()

    const overdueOrders = orders.filter(
      (order) =>
        !order.isPermanent && ((order.month && order.month < currentMonth) || (order.year && order.year < currentYear)),
    )

    if (overdueOrders.length > 0) {
      overdueOrders.forEach((order) => {
        editOrder(order.id, {
          isOverdue: true,
          originalYear: order.originalYear ?? order.year,
          originalMonth: order.originalMonth ?? order.month,
          year: currentYear,
          month: currentMonth,
        })
      })
    }
  }, [editOrder, orders])

  const value: OrderStore = useMemo(
    () => ({
      orders,
      sortedOrders,
      currentYearCompletedOrders,
      sortOrders,
      addOrder,
      completeOrder,
      editOrder,
      deleteOrder,
    }),
    [addOrder, completeOrder, currentYearCompletedOrders, deleteOrder, editOrder, orders, sortOrders, sortedOrders],
  )

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}
