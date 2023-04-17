import { FC, memo, useCallback, useState } from 'react'

import { ReactComponent as IconComplete } from 'assets/images/complete-small.svg'
import { ReactComponent as IconEdit } from 'assets/images/edit-small.svg'
import { ReactComponent as IconDelete } from 'assets/images/delete-small.svg'

import { useOrder } from 'contexts/order-context'
import { CompleteOrderPopup } from 'components/popup/complete-order-popup'
import { DeleteOrderPopup } from 'components/popup/delete-order-popup'

import styles from './card-actions.module.scss'

interface CardActionsProperties {
  orderId: string
  onClickEdit: () => void
}

const CardActions: FC<CardActionsProperties> = ({ orderId, onClickEdit }) => {
  const { completeOrder, deleteOrder } = useOrder()

  const [isCompletePopupVisible, setCompletePopupVisible] = useState<boolean>(false)
  const [isDeletePopupVisible, setDeletePopupVisible] = useState<boolean>(false)

  const openCompletePopup = useCallback((): void => setCompletePopupVisible(true), [])
  const closeCompletePopup = useCallback((): void => setCompletePopupVisible(false), [])

  const openDeletePopup = useCallback((): void => setDeletePopupVisible(true), [])
  const closeDeletePopup = useCallback((): void => setDeletePopupVisible(false), [])

  const onCompleteOrder = useCallback((): void => {
    completeOrder(orderId).catch((error) => console.error(`Can't complete order for a reason: ${error}`))
  }, [completeOrder, orderId])

  const onDeleteOrder = useCallback((): void => {
    deleteOrder(orderId).catch((error) => console.error(`Can't delete order for a reason: ${error}`))
  }, [deleteOrder, orderId])

  return (
    <>
      <ul className={styles.actions}>
        <li>
          <button type="button" aria-label="complete" onClick={openCompletePopup}>
            <IconComplete aria-hidden />
          </button>
        </li>
        <li>
          <button type="button" aria-label="edit" onClick={onClickEdit}>
            <IconEdit aria-hidden />
          </button>
        </li>
        <li>
          <button type="button" aria-label="delete" onClick={openDeletePopup}>
            <IconDelete aria-hidden />
          </button>
        </li>
      </ul>

      <CompleteOrderPopup
        isVisible={isCompletePopupVisible}
        onComplete={onCompleteOrder}
        onCancel={closeCompletePopup}
      />
      <DeleteOrderPopup isVisible={isDeletePopupVisible} onDelete={onDeleteOrder} onCancel={closeDeletePopup} />
    </>
  )
}

export default memo(CardActions)
