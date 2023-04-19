import { FC, memo } from 'react'

import { ReactComponent as IconPermanent } from 'assets/images/permanent.svg'

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
    return (
      <IconPermanent
        aria-label="permanent"
        className={getClassNamesWithCompleted(styles['permanent-icon'], Boolean(data.isCompleted))}
      />
    )
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
