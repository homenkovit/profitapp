import { FC, memo } from 'react'

import { useOrder } from 'contexts/order-context'

import { OrderItem } from '../order-item'

import styles from './order-list.module.scss'

const OrderList: FC = () => {
  const { sortedOrders } = useOrder()

  return (
    <ul className={styles.list}>
      {sortedOrders.map((order) => (
        <li key={order.id}>
          <OrderItem data={order} />
        </li>
      ))}
    </ul>
  )
}

export default memo(OrderList)
