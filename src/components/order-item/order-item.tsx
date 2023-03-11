/* eslint-disable max-lines */
import { FC, useState, useRef, useLayoutEffect, memo } from 'react'

import { ReactComponent as IconPermanent } from '../../assets/images/permanent.svg'
import { ReactComponent as IconComplete } from '../../assets/images/complete-small.svg'
import { ReactComponent as IconEdit } from '../../assets/images/edit-small.svg'
import { ReactComponent as IconDelete } from '../../assets/images/delete-small.svg'
import { ReactComponent as IcExpand } from '../../assets/images/expand.svg'
import { DeleteOrderPopup } from '../popup/delete-order-popup'
import { useOrder, Order } from '../../contexts/order-context'
import { CompleteOrderPopup } from '../popup/complete-order-popup'
import { MONTHS } from '../../utils'

import styles from './order-item.module.scss'
import { OrderItemForm } from './components/order-item-form'
import { decodeText } from './components/order-item-form/order-item-form-utils'

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

  return (
    <>
      <div className={`${styles.card} ${data.isPermanent ? styles.permanent : styles.single}`}>
        {isExpandButtonVisible ? (
          <button
            type="button"
            aria-label="expand"
            className={styles['expand-button']}
            onClick={(): void => setIsDescriptionExpand(!isDescriptionExpand)}
          >
            <div className={`${styles.description} ${isDescriptionExpand ? styles['full-text'] : ''}`}>
              {decodeText(data.description)}
            </div>
            <IcExpand
              className={`${styles['expand-icon']} ${isDescriptionExpand ? styles.expanded : ''}`}
              aria-hidden
            />
          </button>
        ) : (
          <p className={styles.description} ref={descriptionReference}>
            {decodeText(data.description)}
          </p>
        )}
        <div className={styles['last-row']}>
          <strong className={styles.price}>{data.price} ₽</strong>
          {data.isPermanent ? (
            <IconPermanent aria-label="permanent" className={styles['permanent-icon']} />
          ) : (
            data.month !== undefined && <mark className={styles.month}>{MONTHS[data.month]}</mark>
          )}
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
