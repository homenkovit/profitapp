/* eslint-disable max-lines */
import { FC, useState, useRef, useLayoutEffect, memo } from 'react'

import { ReactComponent as IconPermanent } from 'assets/images/permanent.svg'
import { ReactComponent as IconComplete } from 'assets/images/complete-small.svg'
import { ReactComponent as IconEdit } from 'assets/images/edit-small.svg'
import { ReactComponent as IconDelete } from 'assets/images/delete-small.svg'
import { ReactComponent as IconExpand } from 'assets/images/expand.svg'
import { ReactComponent as IconOverdue } from 'assets/images/overdue.svg'

import { MONTHS } from 'utils'
import { DeleteOrderPopup } from 'components/popup/delete-order-popup'
import { CompleteOrderPopup } from 'components/popup/complete-order-popup'
import { useOrder } from 'contexts/order-context'
import type { Order } from 'contexts/order-context'

import { OrderItemForm } from './components/order-item-form'
import { decodeText } from './components/order-item-form/order-item-form-utils'
import styles from './order-item.module.scss'

interface OrderItemProperties {
  data: Order
}

const OrderItem: FC<OrderItemProperties> = ({ data }) => {
  const { completeOrder, deleteOrder } = useOrder()

  const [isForm, setIsForm] = useState<boolean>(false)
  const [isDeletePopupVisible, setDeletePopupVisible] = useState<boolean>(false)
  const [isCompletePopupVisible, setCompletePopupVisible] = useState<boolean>(false)
  const [isDescriptionExpand, setIsDescriptionExpand] = useState<boolean>(false)
  const [isExpandButtonVisible, setExpandButtonVisible] = useState<boolean>(false)

  const descriptionReference = useRef<HTMLParagraphElement>(null)

  useLayoutEffect(() => {
    const description = descriptionReference.current
    if (description && !isDescriptionExpand) {
      if (description.offsetWidth < description.scrollWidth) {
        setExpandButtonVisible(true)
      } else {
        setExpandButtonVisible(false)
      }
    }
  }, [data.description, isDescriptionExpand])

  if (isForm) {
    return <OrderItemForm data={data} onClose={(): void => setIsForm(false)} />
  }

  const getCardStyles = (): string => {
    let additionalStyles = styles.single

    if (data.isPermanent) {
      additionalStyles = styles.permanent
    }

    if (data.isOverdue) {
      additionalStyles = styles.overdue
    }

    return `${styles.card} ${additionalStyles}`
  }

  const getCardLabel = (): JSX.Element | null => {
    if (data.isPermanent) {
      return <IconPermanent aria-label="permanent" className={styles['permanent-icon']} />
    }

    if (data.isOverdue && data.originalMonth !== undefined) {
      return (
        <div className={styles.labels}>
          <mark className={`${styles.month} ${styles.overdue}`}>{MONTHS[data.originalMonth]}</mark>
          <mark className={styles['overdue-label']}>просрочен</mark>
        </div>
      )
    }

    if (data.month !== undefined) {
      return <mark className={styles.month}>{MONTHS[data.month]}</mark>
    }

    return null
  }

  return (
    <>
      <div className={getCardStyles()}>
        {isExpandButtonVisible ? (
          <button
            type="button"
            aria-label="expand"
            className={styles['expand-button']}
            onClick={(): void => setIsDescriptionExpand(!isDescriptionExpand)}
          >
            <div className={`${styles.description} ${isDescriptionExpand ? styles['full-text'] : ''}`}>
              {data.isOverdue && <IconOverdue className={styles['overdue-icon']} />}
              {decodeText(data.description)}
            </div>
            <IconExpand
              className={`${styles['expand-icon']} ${isDescriptionExpand ? styles.expanded : ''}`}
              aria-hidden
            />
          </button>
        ) : (
          <p className={styles.description} ref={descriptionReference}>
            {data.isOverdue && <IconOverdue className={styles['overdue-icon']} />}
            {decodeText(data.description)}
          </p>
        )}
        <div className={styles['last-row']}>
          <strong className={styles.price}>{data.price} ₽</strong>
          {getCardLabel()}
        </div>
        <ul className={styles.actions}>
          <li>
            <button type="button" aria-label="complete" onClick={(): void => setCompletePopupVisible(true)}>
              <IconComplete aria-hidden />
            </button>
          </li>
          <li>
            <button type="button" aria-label="edit" onClick={(): void => setIsForm(true)}>
              <IconEdit aria-hidden />
            </button>
          </li>
          <li>
            <button type="button" aria-label="delete" onClick={(): void => setDeletePopupVisible(true)}>
              <IconDelete aria-hidden />
            </button>
          </li>
        </ul>
      </div>
      <CompleteOrderPopup
        isVisible={isCompletePopupVisible}
        onComplete={(): void => {
          completeOrder(data.id).catch((error) => console.error(`Can't complete order for a reason: ${error}`))
        }}
        onCancel={(): void => setCompletePopupVisible(false)}
      />
      <DeleteOrderPopup
        isVisible={isDeletePopupVisible}
        onDelete={(): void => {
          deleteOrder(data.id).catch((error) => console.error(`Can't delete order for a reason: ${error}`))
        }}
        onCancel={(): void => setDeletePopupVisible(false)}
      />
    </>
  )
}

export default memo(OrderItem)
