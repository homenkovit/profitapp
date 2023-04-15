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
  const [sortedOrders, setSortedOrders] = useState<Order[]>([])

  useEffect(() => {
    if (!localStorage.getItem(LOCAL_STORAGE_SORT_KEY)) {
      localStorage.setItem(LOCAL_STORAGE_SORT_KEY, DEFAULT_SORT_TYPE)
    }
  }, [])

  const sortOrders = useCallback(
    (sortType: SortOrders) => {
      localStorage.setItem(LOCAL_STORAGE_SORT_KEY, JSON.stringify(sortType))

      if (sortType.name === SortOrdersName.DATE && sortType.type === 'asc') {
        setSortedOrders([...orders].sort((previous, next) => Number(previous.createdAt) - Number(next.createdAt)))
        return
      }
      if (sortType.name === SortOrdersName.DATE && sortType.type === 'desc') {
        setSortedOrders([...orders].sort((previous, next) => Number(next.createdAt) - Number(previous.createdAt)))
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
            return 0
          }),
        )
        return
      }
      if (sortType.name === SortOrdersName.ONCE) {
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
        return
      }
      if (sortType.name === SortOrdersName.OVERDUE) {
        setSortedOrders(
          [...orders].sort((previous, next) => {
            if (Boolean(previous.isOverdue) < Boolean(next.isOverdue)) {
              return -1
            }
            if (Boolean(previous.isOverdue) > Boolean(next.isOverdue)) {
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

    const sortType = JSON.parse(sortTypeFromLocalStorage) as SortOrders
    if ('name' in sortType) {
      sortOrders(sortType)
    }
  }, [orders, sortOrders])

  return { sortedOrders, sortOrders }
}
