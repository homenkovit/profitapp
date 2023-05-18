import { FC, memo } from 'react'

import { ConfirmationPopup } from 'components/popup/confirmation-popup'
import { useAuth } from 'contexts/auth-context'

interface LogoutWarningPopupProperties {
  isVisible: boolean
  onClose: () => void
  onCancel: () => void
  onSignUp: () => void
}

const LogoutWarningPopup: FC<LogoutWarningPopupProperties> = ({ isVisible, onClose, onCancel, onSignUp }) => {
  const { signOut } = useAuth()

  return (
    <ConfirmationPopup
      isVisible={isVisible}
      width="410px"
      emoji="😳"
      message="Если вы выйдете из анонимного режима, вы потеряете все ваши заказы! Чтобы сохранить их, зарегистрируйтесь."
      onClose={onClose}
      actionsList={[
        <button key="signin" type="button" className="btn btn-primary" onClick={signOut}>
          Выйти
        </button>,
        <button key="signup" type="button" className="btn btn-default" onClick={onSignUp}>
          Зарегистрироваться
        </button>,
        <button key="cancel" type="button" className="btn btn-danger" onClick={onCancel}>
          Окей, отмена
        </button>,
      ]}
    />
  )
}

export default memo(LogoutWarningPopup)
