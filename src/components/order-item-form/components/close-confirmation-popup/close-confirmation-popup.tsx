import { FC, memo } from 'react'

import { ConfirmationPopup } from 'components/popup/confirmation-popup'

interface CloseConfirmationPopupProperties {
  isVisible: boolean
  onClose: () => void
  onClickYes: () => void
  onClickNo: () => void
}

const CloseConfirmationPopup: FC<CloseConfirmationPopupProperties> = ({
  isVisible,
  onClose,
  onClickYes,
  onClickNo,
}) => {
  return (
    <ConfirmationPopup
      isVisible={isVisible}
      onClose={onClose}
      message="Вы собираетесь закрыть форму, но у вас есть несохранённые изменения в заказе, сохранить?"
      emoji="🧐"
      actionsList={[
        <button type="button" className="btn btn-primary" onClick={onClickYes} key="yes">
          Да
        </button>,
        <button type="button" className="btn btn-default" onClick={onClickNo} key="no">
          Нет
        </button>,
        <button type="button" className="btn btn-danger" onClick={onClose} key="cancel">
          Стой!
        </button>,
      ]}
    />
  )
}

export default memo(CloseConfirmationPopup)
