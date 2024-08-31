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

interface OrderStoreValue {
  isOrdersLoading: boolean
  isCompletedOrdersLoading: boolean
  orders: Order[]
  sortedOrders: Order[]
  completedOrders: Order[]
  currentYearCompletedOrders: Order[]
}

interface OrderStoreHandlers {
  addOrder: (order: StoreOrder) => Promise<DocumentReference<DocumentData>>
  completeOrder: (id: string) => Promise<void>
  editOrder: (id: string, data: Partial<StoreOrder>) => Promise<void>
  deleteOrder: (id: string) => Promise<void>
  sortOrders: (sortType: SortOrders) => void
}

const OrderContextValue = createContext<OrderStoreValue | null>(null)
const OrderContextHandlers = createContext<OrderStoreHandlers | null>(null)

export const useOrderValue = (): OrderStoreValue => {
  const store = useContext(OrderContextValue)

  if (!store) {
    throw new Error("Order store isn't initialized yet")
  }

  return store
}

export const useOrderHandlers = (): OrderStoreHandlers => {
  const handlers = useContext(OrderContextHandlers)

  if (!handlers) {
    throw new Error("Order store isn't initialized yet")
  }

  return handlers
}

export const OrderProvider: FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth()

  const database = useMemo(() => getFirestore(), [])
  const ordersCollection = useMemo(() => collection(database, 'orders'), [database])

  const [isOrdersLoading, setOrdersLoading] = useState<boolean>(true)
  const [isCompletedOrdersLoading, setCompletedOrdersLoading] = useState<boolean>(true)
  const [orders, setOrders] = useState<Order[]>([])
  const [completedOrders, setCompletedOrders] = useState<Order[]>([])
  const [currentYearCompletedOrders, setCurrentYearCompletedOrders] = useState<Order[]>([])

  const { sortedOrders, sortOrders } = useSortedOrders(orders)

  useEffect(() => {
    if (!user) {
      setOrders([])
      setCompletedOrders([])
      setCurrentYearCompletedOrders([])
    }
  }, [user])

  useEffect(() => {
    if (!user) return undefined

    const { uid } = user
    const ordersQuery = query(ordersCollection, where('uid', '==', uid), where('isCompleted', '==', true))

    return onSnapshot(ordersQuery, (querySnapshot) => {
      setCompletedOrders(
        querySnapshot.docs.map((document_) => {
          const documentData = document_.data() as StoreOrder

          return {
            id: document_.id,
            ...documentData,
          }
        }),
      )
      setCompletedOrdersLoading(false)
    })
  }, [ordersCollection, user])

  useEffect(() => {
    setCurrentYearCompletedOrders(
      completedOrders.filter(({ completedYear }) => completedYear === new Date().getFullYear()),
    )
  }, [completedOrders])

  useEffect(() => {
    if (!user) return undefined

    const { uid } = user
    const ordersQuery = query(ordersCollection, where('uid', '==', uid), where('isCompleted', '==', false))

    return onSnapshot(ordersQuery, (querySnapshot) => {
      setOrders(
        querySnapshot.docs.map((document_) => {
          const documentData = document_.data() as StoreOrder

          return {
            id: document_.id,
            ...documentData,
          }
        }),
      )
      setOrdersLoading(false)
    })
  }, [ordersCollection, user])

  const addOrder = useCallback(
    (order: StoreOrder) => addDoc(ordersCollection, { ...order, createdAt: serverTimestamp() }),
    [ordersCollection],
  )

  const completeOrder = useCallback(
    (id: string) => {
      const additionalOptions: Partial<StoreOrder> = {}
      const currentOrder = orders.find((order) => order.id === id)

      const currentYear = new Date().getFullYear()
      const currentMonth = new Date().getMonth()

      if (currentOrder?.year !== undefined && currentOrder.year > currentYear) {
        additionalOptions.year = currentYear
        additionalOptions.month = currentMonth
      }

      if (
        currentOrder?.month !== undefined &&
        currentOrder.month > currentMonth &&
        additionalOptions.month === undefined
      ) {
        additionalOptions.month = currentMonth
      }

      return updateDoc(doc(ordersCollection, id), {
        isCompleted: true,
        updatedAt: serverTimestamp(),
        completedYear: new Date().getFullYear(),
        completedMonth: new Date().getMonth(),
        ...additionalOptions,
      })
    },
    [orders, ordersCollection],
  )

  const editOrder = useCallback(
    (id: string, data: Partial<StoreOrder>) => {
      let additionalOptions
      const currentOrder = orders.find((order) => order.id === id)

      if (
        currentOrder?.isOverdue &&
        currentOrder.year &&
        currentOrder.month &&
        ((data.year && data.year > currentOrder.year) || (data.month && data.month > currentOrder.month))
      ) {
        additionalOptions = {
          isOverdue: deleteField(),
          originalYear: deleteField(),
          originalMonth: deleteField(),
        }
      }

      return updateDoc(doc(ordersCollection, id), { ...data, ...additionalOptions, updatedAt: serverTimestamp() })
    },
    [orders, ordersCollection],
  )

  const deleteOrder = useCallback((id: string) => deleteDoc(doc(ordersCollection, id)), [ordersCollection])

  useEffect(() => {
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()

    const overdueOrders = orders.filter(
      (order) =>
        !order.isPermanent &&
        ((order.year && order.year < currentYear) ||
          (order.year === currentYear && order.month && order.month < currentMonth)),
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

  const value: OrderStoreValue = useMemo(
    () => ({
      isOrdersLoading,
      isCompletedOrdersLoading,
      orders,
      sortedOrders,
      completedOrders,
      currentYearCompletedOrders,
    }),
    [isOrdersLoading, isCompletedOrdersLoading, orders, sortedOrders, completedOrders, currentYearCompletedOrders],
  )

  const handlers = useMemo(
    () => ({
      addOrder,
      completeOrder,
      editOrder,
      deleteOrder,
      sortOrders,
    }),
    [addOrder, completeOrder, editOrder, deleteOrder, sortOrders],
  )

  return (
    <OrderContextValue.Provider value={value}>
      <OrderContextHandlers.Provider value={handlers}>{children}</OrderContextHandlers.Provider>
    </OrderContextValue.Provider>
  )
}
