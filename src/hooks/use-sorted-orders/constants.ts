export enum SortOrdersName {
  DATE = 'DATE',
  PRICE = 'PRICE',
  PERMANENT = 'PERMANENT',
  ONCE = 'ONCE',
  OVERDUE = 'OVERDUE',
}

export const LOCAL_STORAGE_SORT_KEY = 'sortType'

export const DEFAULT_SORT_TYPE = JSON.stringify({ name: SortOrdersName.DATE, type: 'desc' })
