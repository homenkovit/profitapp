import { FC, memo } from 'react'

import { SortOrdersName } from 'hooks/use-sorted-orders'

import styles from './sort-bar.module.scss'
import SortButton from './components/sort-button/sort-button'

const SortBar: FC = () => {
  return (
    <>
      <span className={styles.text}>сортировать по: </span>
      <ul className={styles.list}>
        {Object.values(SortOrdersName).map((sortOrdersName) => (
          <li key={sortOrdersName}>
            <SortButton sortOrdersName={sortOrdersName} />
          </li>
        ))}
      </ul>
    </>
  )
}

export default memo(SortBar)
