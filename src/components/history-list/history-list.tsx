import { FC, memo, useMemo } from 'react'
import { NavLink } from 'react-router-dom'

import { ReactComponent as IconCalendar } from 'assets/images/calendar.svg'

import { MONTHS } from 'global/constants'
import { useOrder } from 'contexts/order-context'
import type { Order } from 'contexts/order-context'
import { TopBarPortal } from 'components/top-bar'
import { OrderItem } from 'components/order-item'

import styles from './history-list.module.scss'

const HistoryList: FC = () => {
  const { completedOrders } = useOrder()

  const completedOrdersSortedByDate = useMemo(() => {
    return [...completedOrders].sort(
      (previous, next) =>
        new Date(`${next.completedYear}-${Number(next.completedMonth) + 1}`).getTime() -
        new Date(`${previous.completedYear}-${Number(previous.completedMonth) + 1}`).getTime(),
    )
  }, [completedOrders])

  const groupedOrders = useMemo(() => {
    return completedOrdersSortedByDate.reduce((accumulator, order) => {
      const key = `${MONTHS[order.completedMonth!]}, ${order.completedYear}`
      const ordersByYear = accumulator[key] ?? []

      ordersByYear.push(order)

      return { ...accumulator, [key]: ordersByYear }
    }, {} as Record<string, Order[]>)
  }, [completedOrdersSortedByDate])

  return (
    <>
      <TopBarPortal>
        <NavLink to="/" className={styles.link}>
          ← обратно к заказчикам
        </NavLink>
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
