/* eslint-disable max-lines */
import { useState, useEffect, useCallback } from 'react'

import { Order } from 'contexts/order-context/types'

import { SortOrdersName, LOCAL_STORAGE_SORT_KEY, DEFAULT_SORT_TYPE } from './constants'
import type { SortOrders } from './types'

interface UseSortedOrdersReturn {
  sortedOrders: Order[]
  sortOrders: (sortType: SortOrders) => void
}

export const useSortedOrders = (orders: Order[]): UseSortedOrdersReturn => {
  const [sortedOrders, setSortedOrders] = useState<Order[]>(orders)

  useEffect(() => {
    const sortTypeFromLocalStorage = localStorage.getItem(LOCAL_STORAGE_SORT_KEY)

    const setDefaultSortType = (): void => {
      localStorage.setItem(LOCAL_STORAGE_SORT_KEY, DEFAULT_SORT_TYPE)
    }

    if (!sortTypeFromLocalStorage) {
      setDefaultSortType()
      return
    }

    try {
      const sortType = JSON.parse(sortTypeFromLocalStorage) as SortOrders
      if (!sortType.name) {
        setDefaultSortType()
      }
    } catch (error) {
      console.error(`Can't parse sort type ${sortTypeFromLocalStorage} from local storage: ${error}`)
      setDefaultSortType()
    }
  }, [])

  const sortOrders = useCallback(
    (sortType: SortOrders) => {
      localStorage.setItem(LOCAL_STORAGE_SORT_KEY, JSON.stringify(sortType))

      if (sortType.name === SortOrdersName.DATE && sortType.type === 'asc') {
        setSortedOrders(
          [...orders].sort((previous, next) => {
            if (next.isPermanent) return -1

            const previousDate = new Date(
              previous.createdAt.seconds * 1000 + previous.createdAt.nanoseconds / 1_000_000,
            ).getTime()
            const nextDate = new Date(next.createdAt.seconds * 1000 + next.createdAt.nanoseconds / 1_000_000).getTime()

            return previousDate - nextDate
          }),
        )
        return
      }
      if (sortType.name === SortOrdersName.DATE && sortType.type === 'desc') {
        setSortedOrders(
          [...orders].sort((previous, next) => {
            if (next.isPermanent) return -1

            const previousDate = new Date(
              previous.createdAt.seconds * 1000 + previous.createdAt.nanoseconds / 1_000_000,
            ).getTime()
            const nextDate = new Date(next.createdAt.seconds * 1000 + next.createdAt.nanoseconds / 1_000_000).getTime()

            return nextDate - previousDate
          }),
        )
        return
      }
      if (sortType.name === SortOrdersName.PRICE && sortType.type === 'asc') {
        setSortedOrders([...orders].sort((previous, next) => previous.price - next.price))
        return
      }
      if (sortType.name === SortOrdersName.PRICE && sortType.type === 'desc') {
        setSortedOrders([...orders].sort((previous, next) => next.price - previous.price))
        return
      }
      if (sortType.name === SortOrdersName.PERMANENT) {
        setSortedOrders(
          [...orders].sort((previous, next) => {
            if (previous.isPermanent > next.isPermanent) {
              return -1
            }
            if (previous.isPermanent < next.isPermanent) {
              return 1
            }

            const previousDate = new Date(
              previous.createdAt.seconds * 1000 + previous.createdAt.nanoseconds / 1_000_000,
            ).getTime()
            const nextDate = new Date(next.createdAt.seconds * 1000 + next.createdAt.nanoseconds / 1_000_000).getTime()

            return nextDate - previousDate
          }),
        )
        return
      }
      if (sortType.name === SortOrdersName.OVERDUE) {
        setSortedOrders(
          [...orders].sort((previous, next) => {
            if (Boolean(previous.isOverdue) > Boolean(next.isOverdue)) {
              return -1
            }
            if (Boolean(previous.isOverdue) < Boolean(next.isOverdue)) {
              return 1
            }
            return 0
          }),
        )
        return
      }

      throw new Error(`Sort type ${sortType} not implemented`)
    },
    [orders],
  )

  useEffect(() => {
    const sortTypeFromLocalStorage = localStorage.getItem(LOCAL_STORAGE_SORT_KEY)

    if (!sortTypeFromLocalStorage) return

    try {
      const sortType = JSON.parse(sortTypeFromLocalStorage) as SortOrders
      if ('name' in sortType) {
        sortOrders(sortType)
      }
    } catch (error) {
      console.error(`Can't parse sort type ${sortTypeFromLocalStorage} from local storage: ${error}`)
    }
  }, [sortOrders])

  return { sortedOrders, sortOrders }
}
