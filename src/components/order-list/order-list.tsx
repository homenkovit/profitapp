import { FC, memo } from 'react'

import { useOrder } from 'contexts/order-context'
import { OrderItem } from 'components/order-item'
import { TopBarPortal } from 'components/top-bar'
import { SortBar } from 'components/sort-bar'

import styles from './order-list.module.scss'

const OrderList: FC = () => {
  const { sortedOrders } = useOrder()

  return (
    <>
      <h1 className="visually-hidden">ProfitApp</h1>
      <TopBarPortal>
        <SortBar />
      </TopBarPortal>
      <ul className={styles.list}>
        {sortedOrders.map((order) => (
          <li key={order.id}>
            <OrderItem data={order} />
          </li>
        ))}
      </ul>
    </>
  )
}

export default memo(OrderList)
