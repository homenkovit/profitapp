import { FC, memo } from 'react'

import { MONTHS } from 'global/constants'
import type { Order } from 'contexts/order-context'

import styles from './card-label.module.scss'

interface CardLabelProperties {
  data: Order
}

const getClassNamesWithCompleted = (classNames: string, isCompleted: boolean): string => {
  return `${classNames} ${isCompleted ? styles.completed : ''}`
}

const CardLabel: FC<CardLabelProperties> = ({ data }) => {
  if (data.isPermanent) {
    return <mark className={getClassNamesWithCompleted(styles.permanent, Boolean(data.isCompleted))}>ежемесячно</mark>
  }

  if (data.isOverdue && data.originalMonth !== undefined) {
    return (
      <div className={styles.labels}>
        {' '}
        <mark className={`${styles.month} ${styles.overdue}`}> {MONTHS[data.originalMonth]}</mark>{' '}
        <mark className={styles['overdue-label']}>просрочен</mark>{' '}
      </div>
    )
  }

  if (data.month !== undefined) {
    return (
      <mark className={getClassNamesWithCompleted(styles.month, Boolean(data.isCompleted))}> {MONTHS[data.month]}</mark>
    )
  }

  return null
}

export default memo(CardLabel)
