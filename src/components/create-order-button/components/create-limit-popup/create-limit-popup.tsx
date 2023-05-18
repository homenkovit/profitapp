import { FC, memo, useCallback } from 'react'

import { useAuth } from 'contexts/auth-context'
import { ConfirmationPopup } from 'components/popup/confirmation-popup'

import { CREATION_LIMIT } from '../../constants'

interface CreateLimitPopupProperties {
  isVisible: boolean
  onSignIn: () => void
  onSignUp: () => void
  onCancel: () => void
}

const CreateLimitPopup: FC<CreateLimitPopupProperties> = ({ isVisible, onSignIn, onSignUp, onCancel }) => {
  const { user } = useAuth()

  const getMessage = useCallback((): string => {
    if (user?.isAnonymous) {
      return `Чтобы создать больше ${CREATION_LIMIT} заказов, пожалуйста, зарегистрируйтесь или войдите в свой аккаунт!`
    }
    if (!user?.emailVerified) {
      return `Чтобы создать больше ${CREATION_LIMIT} заказов, пожалуйста, подтвердите свой почту!`
    }

    return 'По какой-то причине вы не можете создать больше заказов.'
  }, [user])

  return (
    <ConfirmationPopup
      isVisible={isVisible}
      width="410px"
      emoji="😔"
      message={getMessage()}
      actionsList={[
        <button key="signin" type="button" className="btn btn-primary" onClick={onSignIn}>
          Войти
        </button>,
        <button key="signup" type="button" className="btn btn-default" onClick={onSignUp}>
          Зарегистрироваться
        </button>,
        <button key="cancel" type="button" className="btn btn-danger" onClick={onCancel}>
          Окей, отмена
        </button>,
      ]}
      onClose={onCancel}
    />
  )
}

export default memo(CreateLimitPopup)
