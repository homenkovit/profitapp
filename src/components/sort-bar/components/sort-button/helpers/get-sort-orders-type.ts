import { SortOrdersName } from 'hooks/use-sorted-orders'
import type { SortOrdersType } from 'hooks/use-sorted-orders'

export const getSortOrdersType = (
  sortOrdersName: SortOrdersName,
  sortOrdersType?: SortOrdersType,
): SortOrdersType | undefined => {
  if (sortOrdersType) return sortOrdersType

  if ([SortOrdersName.DATE, SortOrdersName.PRICE].includes(sortOrdersName)) return 'desc'

  return undefined
}
