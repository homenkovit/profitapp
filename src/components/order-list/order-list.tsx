import { FC, memo } from 'react'

import { useOrderValue } from 'contexts/order-context'
import { PageLoader } from 'router/components/page-loader'
import { OrderItem } from 'components/order-item'
import { TopBarPortal } from 'components/top-bar'
import { SortBar } from 'components/sort-bar'

import styles from './order-list.module.scss'

const OrderList: FC = () => {
  const { isOrdersLoading, sortedOrders } = useOrderValue()

  if (isOrdersLoading) {
    return <PageLoader />
  }

  return (
    <>
      <h1 className="visually-hidden">ProfitApp</h1>
      <TopBarPortal>
        <SortBar />
      </TopBarPortal>
      <ul id="order-list" className={styles.list}>
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
