import { FC, memo } from 'react'

import { ConfirmationPopup } from '../confirmation-popup'

interface CompleteOrderPopupProperties {
  isVisible: boolean
  onComplete: () => void
  onCancel: () => void
}

const CompleteOrderPopup: FC<CompleteOrderPopupProperties> = ({ onCancel, onComplete, isVisible }) => {
  return (
    <ConfirmationPopup
      isVisible={isVisible}
      onClose={onCancel}
      emoji="🎉"
      message="Ну что же, судя по всему работа выполнена!"
      actionsList={[
        <button type="button" className="btn btn-primary" onClick={onComplete} key="complete">
          Готово
        </button>,
        <button type="button" className="btn btn-default" onClick={onCancel} key="cancel">
          Погоди!
        </button>,
      ]}
    />
  )
}

export default memo(CompleteOrderPopup)
