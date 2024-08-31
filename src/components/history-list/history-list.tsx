import { FC, memo, useMemo } from 'react'

import IconCalendar from 'assets/images/calendar.svg?react'

import { MONTHS } from 'global/constants'
import { useOrderValue } from 'contexts/order-context'
import type { Order } from 'contexts/order-context'
import { PageLoader } from 'router/components/page-loader'
import { TopBarPortal } from 'components/top-bar'
import { BackToOrdersLink } from 'components/back-to-orders-link'
import { OrderItem } from 'components/order-item'

import styles from './history-list.module.scss'

const HistoryList: FC = () => {
  const { isCompletedOrdersLoading, completedOrders } = useOrderValue()

  const completedOrdersSortedByDate = useMemo(() => {
    return [...completedOrders].sort(
      (previous, next) =>
        new Date(Number(next.completedYear), Number(next.completedMonth) + 1).getTime() -
        new Date(Number(previous.completedYear), Number(previous.completedMonth) + 1).getTime(),
    )
  }, [completedOrders])

  const groupedOrders = useMemo(() => {
    return completedOrdersSortedByDate.reduce(
      (accumulator, order) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const key = `${MONTHS[order.completedMonth!]}, ${order.completedYear}`
        const ordersByYear = accumulator[key] ?? []

        ordersByYear.push(order)

        return { ...accumulator, [key]: ordersByYear }
      },
      {} as Record<string, Order[]>,
    )
  }, [completedOrdersSortedByDate])

  if (isCompletedOrdersLoading) {
    return <PageLoader />
  }

  return (
    <>
      <TopBarPortal>
        <BackToOrdersLink />
      </TopBarPortal>
      <h1 className={styles.head}>История заказов</h1>
      {Object.entries(groupedOrders).map(([date, orders]) => (
        <div key={date} className={styles.group}>
          <h2 className={styles.date}>
            <IconCalendar className={styles.calendar} aria-hidden />
            {date}
          </h2>
          <ul className={styles.list}>
            {orders.map((order) => (
              <li key={order.id}>
                <OrderItem data={order} />
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  )
}

export default memo(HistoryList)
