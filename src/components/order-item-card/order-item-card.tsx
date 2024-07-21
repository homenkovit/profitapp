import { FC, memo, useRef } from 'react'

import IconOverdue from 'assets/images/overdue.svg?react'

import { decodeText } from 'global/helpers'
import type { Order } from 'contexts/order-context'

import { getCardStyles } from './helpers'
// import { ExpandableCardDescription } from './components/expandable-card-description'
import { CardLabel } from './components/card-label'
import { CardActions } from './components/card-actions'
import styles from './order-item-card.module.scss'

interface OrderItemCardProperties {
  data: Order
  onClickEdit: () => void
}

const OrderItemCard: FC<OrderItemCardProperties> = ({ data, onClickEdit }) => {
  const descriptionReference = useRef<HTMLParagraphElement>(null)

  return (
    <div className={getCardStyles(styles, data)}>
      <p className={styles.description} ref={descriptionReference}>
        {data.isOverdue && <IconOverdue className={styles['overdue-icon']} />}
        {decodeText(data.description)}
      </p>
      <div className={styles['last-row']}>
        <strong className={styles.price}>
          {data.price.toLocaleString('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            maximumFractionDigits: 0,
          })}
        </strong>
        <CardLabel data={data} />
      </div>
      {!data.isCompleted && <CardActions orderId={data.id} onClickEdit={onClickEdit} />}
    </div>
  )
}

export default memo(OrderItemCard)
