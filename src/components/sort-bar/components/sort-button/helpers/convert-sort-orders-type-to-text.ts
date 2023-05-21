import { SortOrdersName } from 'hooks/use-sorted-orders'
import type { SortOrders } from 'hooks/use-sorted-orders'

export const convertSortOrdersTypeToText = (sortType: SortOrders): string => {
  if (sortType.name === SortOrdersName.DATE && sortType.type === 'asc') {
    return 'дате ↑'
  }
  if (sortType.name === SortOrdersName.DATE && sortType.type === 'desc') {
    return 'дате ↓'
  }
  if (sortType.name === SortOrdersName.PRICE && sortType.type === 'asc') {
    return 'цене ↑'
  }
  if (sortType.name === SortOrdersName.PRICE && sortType.type === 'desc') {
    return 'цене ↓'
  }
  if (sortType.name === SortOrdersName.PERMANENT) {
    return 'постоянные'
  }
  if (sortType.name === SortOrdersName.OVERDUE) {
    return 'просроченные'
  }

  throw new Error(`Can't find sort type ${sortType}`)
}
