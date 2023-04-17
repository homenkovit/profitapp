import { FC, memo } from 'react'

import { ConfirmationPopup } from '../confirmation-popup'

interface DeleteOrderPopupProperties {
  isVisible: boolean
  onDelete: () => void
  onCancel: () => void
}

const DeleteOrderPopup: FC<DeleteOrderPopupProperties> = ({ isVisible, onCancel, onDelete }) => {
  return (
    <ConfirmationPopup
      isVisible={isVisible}
      onClose={onCancel}
      emoji="😧"
      message="Вы уверены, что хотите удалить заказ?"
      actionsList={[
        <button type="button" className="btn btn-danger" onClick={onDelete} key="delete">
          Удалить
        </button>,
        <button type="button" className="btn btn-default" onClick={onCancel} key="cancel">
          Ой, стоп!
        </button>,
      ]}
    />
  )
}

export default memo(DeleteOrderPopup)
