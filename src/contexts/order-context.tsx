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
  Timestamp,
} from 'firebase/firestore'

import { MONTHS } from '../utils'

import { useAuth } from './auth-context'

export interface Order {
  id: string
  description: string
  price: number
  isPermanent: boolean
  year?: number
  month?: number
  isCompleted?: boolean
  completedYear?: number
  completedMonth?: number
  createdAt: Timestamp | null
  updatedAt?: Timestamp | null
}

export interface StoreOrder extends Omit<Order, 'id'> {
  uid: string
}

interface OrderStore {
  orders: Order[]
  sortedOrders: Order[]
  currentYearCompletedOrders: Order[]
  sortOrders: (sortType: SortType) => void
  addOrder: (order: StoreOrder) => Promise<DocumentReference<DocumentData>>
  completeOrder: (id: string) => Promise<void>
  editOrder: (id: string, data: Partial<StoreOrder>) => Promise<void>
  deleteOrder: (id: string) => Promise<void>
}

export enum SortType {
  DATE_DESC = 'DATE_DESC',
  DATE_ASC = 'DATE_ASC',
  PRICE_DESC = 'PRICE_DESC',
  PRICE_ASC = 'PRICE_ASC',
  PERMANENT = 'PERMANENT',
  ONCE = 'ONCE',
}

export const LOCAL_STORAGE_SORT_KEY = 'sortType'
const DEFAULT_SORT_TYPE = SortType.DATE_DESC

export const sortTypeToText = (sortType: SortType): string => {
  switch (sortType) {
    case SortType.DATE_ASC: {
      return 'дате ↑'
    }
    case SortType.DATE_DESC: {
      return 'дате ↓'
    }
    case SortType.PRICE_ASC: {
      return 'цене ↑'
    }
    case SortType.PRICE_DESC: {
      return 'цене ↓'
    }
    case SortType.PERMANENT: {
      return 'постоянные'
    }
    case SortType.ONCE: {
      return 'разовые'
    }
    default: {
      throw new Error(`Can't find sort type ${sortType}`)
    }
  }
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
  const [sortedOrders, setSortedOrders] = useState<Order[]>([])
  const [currentYearCompletedOrders, setCurrentYearCompletedOrders] = useState<Order[]>([])

  useEffect(() => {
    if (!localStorage.getItem(LOCAL_STORAGE_SORT_KEY)) {
      localStorage.setItem(LOCAL_STORAGE_SORT_KEY, DEFAULT_SORT_TYPE)
    }
  }, [])

  const sortOrders = useCallback(
    (sortType: SortType) => {
      localStorage.setItem(LOCAL_STORAGE_SORT_KEY, sortType)
      switch (sortType) {
        case SortType.DATE_ASC: {
          setSortedOrders([...orders].sort((previous, next) => Number(previous.createdAt) - Number(next.createdAt)))
          break
        }
        case SortType.DATE_DESC: {
          setSortedOrders([...orders].sort((previous, next) => Number(next.createdAt) - Number(previous.createdAt)))
          break
        }
        case SortType.PRICE_ASC: {
          setSortedOrders([...orders].sort((previous, next) => previous.price - next.price))
          break
        }
        case SortType.PRICE_DESC: {
          setSortedOrders([...orders].sort((previous, next) => next.price - previous.price))
          break
        }
        case SortType.PERMANENT: {
          setSortedOrders(
            [...orders].sort((previous, next) => {
              if (previous.isPermanent > next.isPermanent) {
                return -1
              }
              if (previous.isPermanent < next.isPermanent) {
                return 1
              }
              return 0
            }),
          )
          break
        }
        case SortType.ONCE: {
          setSortedOrders(
            [...orders].sort((previous, next) => {
              if (previous.isPermanent < next.isPermanent) {
                return -1
              }
              if (previous.isPermanent > next.isPermanent) {
                return 1
              }
              return 0
            }),
          )
          break
        }
        default: {
          console.error(`Sort type ${sortType} not implemented`)
        }
      }
    },
    [orders],
  )

  useEffect(() => {
    const sortType = localStorage.getItem(LOCAL_STORAGE_SORT_KEY)
    if (sortType) {
      sortOrders(sortType as SortType)
    }
  }, [orders, sortOrders])

  useEffect(() => {
    if (!user) return

    const { uid } = user
    const ordersQuery = query(ordersCollection, where('uid', '==', uid), where('isCompleted', '==', false))

    // eslint-disable-next-line consistent-return
    return onSnapshot(ordersQuery, (querySnapshot) => {
      setOrders(
        querySnapshot.docs.map((document_) => {
          const { description, isPermanent, year, month, price, createdAt, updatedAt } = document_.data() as StoreOrder

          return {
            id: document_.id,
            description,
            isPermanent,
            year,
            month,
            price,
            createdAt,
            updatedAt,
          }
        }),
      )
    })
  }, [ordersCollection, user])

  useEffect(() => {
    if (!user) return

    const { uid } = user
    const ordersQuery = query(
      ordersCollection,
      where('uid', '==', uid),
      where('isCompleted', '==', true),
      where('completedYear', '==', new Date().getFullYear()),
    )

    // eslint-disable-next-line consistent-return
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
        completedMonth: MONTHS[new Date().getMonth()],
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
