import { FC, memo, useCallback, useState } from 'react'

import { useAuth } from 'contexts/auth-context'
import { useOrderValue } from 'contexts/order-context'
import { AuthorizationPopup } from 'components/popup/authorization-popup'
import { AuthorizationType } from 'components/authorization'

import { CreateLimitPopup } from './components/create-limit-popup'
import { CREATION_LIMIT } from './constants'
import styles from './create-order-button.module.scss'

interface CreateOrderButtonProperties {
  onCreate: () => void
}

const CreateOrderButton: FC<CreateOrderButtonProperties> = ({ onCreate }) => {
  const { user } = useAuth()
  const { orders } = useOrderValue()

  const [isLimitPopupVisible, setLimitPopupVisible] = useState<boolean>(false)
  const [popupType, setPopupType] = useState<AuthorizationType | undefined>()

  const openLimitPopup = useCallback(() => setLimitPopupVisible(true), [])
  const closeLimitPopup = useCallback(() => setLimitPopupVisible(false), [])

  const openSignInPopup = useCallback(() => {
    closeLimitPopup()
    setPopupType(AuthorizationType.SIGN_IN)
  }, [closeLimitPopup])
  const openSignUpPopup = useCallback(() => {
    closeLimitPopup()
    setPopupType(AuthorizationType.SIGN_UP)
  }, [closeLimitPopup])
  const closeSignInUpPopup = useCallback(() => setPopupType(undefined), [])

  const handleButtonClick = (): void => {
    if ((user?.isAnonymous || !user?.emailVerified) && orders.length >= CREATION_LIMIT) {
      openLimitPopup()
      return
    }
    onCreate()
  }

  return (
    <>
      <button type="button" className={styles['add-new-order-button']} onClick={handleButtonClick}>
        Новый заказ
      </button>
      <CreateLimitPopup
        isVisible={isLimitPopupVisible}
        onSignIn={openSignInPopup}
        onSignUp={openSignUpPopup}
        onCancel={closeLimitPopup}
      />
      {popupType !== undefined && <AuthorizationPopup type={popupType} onClose={closeSignInUpPopup} />}
    </>
  )
}

export default memo(CreateOrderButton)
