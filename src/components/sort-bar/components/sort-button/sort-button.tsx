import { FC, memo, useCallback, useEffect, useMemo, useState } from 'react'

import { useOrder } from 'contexts/order-context'
import { SortOrdersName, LOCAL_STORAGE_SORT_KEY } from 'hooks/use-sorted-orders'
import type { SortOrders, SortOrdersType } from 'hooks/use-sorted-orders'

import { convertSortOrdersTypeToText, getSortOrdersType } from './helpers'
import styles from './sort-button.module.scss'

interface SortButtonProperties {
  sortOrdersName: SortOrdersName
}

const SortButton: FC<SortButtonProperties> = ({ sortOrdersName }) => {
  const localStorageSort = localStorage.getItem(LOCAL_STORAGE_SORT_KEY)
  const sortOrdersFromLocalStorage = localStorageSort ? (JSON.parse(localStorageSort) as SortOrders) : null

  const { sortOrders } = useOrder()

  const [sortOrdersType, setSortOrdersType] = useState<SortOrdersType | undefined>(
    getSortOrdersType(sortOrdersName, sortOrdersFromLocalStorage?.type),
  )
  const [selected, setSelected] = useState<boolean>(sortOrdersFromLocalStorage?.name === sortOrdersName)

  useEffect(() => {
    setSelected(sortOrdersFromLocalStorage?.name === sortOrdersName)
  }, [sortOrdersFromLocalStorage?.name, sortOrdersName])

  const buttonClassNames = useMemo(
    () => `
    ${styles.button}
    ${selected ? styles.active : ''}
  `,
    [selected],
  )

  const buttonClickHandler = useCallback(() => {
    let newSortOrdersType = sortOrdersType
    if (selected) {
      if (sortOrdersType === 'asc') {
        newSortOrdersType = 'desc'
      }
      if (sortOrdersType === 'desc') {
        newSortOrdersType = 'asc'
      }
    }

    sortOrders({ name: sortOrdersName, type: newSortOrdersType })

    setSortOrdersType(newSortOrdersType)
    setSelected(true)
  }, [selected, sortOrders, sortOrdersName, sortOrdersType])

  return (
    <button type="button" onClick={buttonClickHandler} className={buttonClassNames}>
      {convertSortOrdersTypeToText({ name: sortOrdersName, type: sortOrdersType })}
    </button>
  )
}

export default memo(SortButton)
