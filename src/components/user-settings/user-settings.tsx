import { FC, memo, useCallback, useEffect, useState } from 'react'
import { AuthErrorCodes } from 'firebase/auth'

import { useAuth } from 'contexts/auth-context'
import { TopBarPortal } from 'components/top-bar'
import { BackToOrdersLink } from 'components/back-to-orders-link'
import { ConfirmationPopup } from 'components/popup/confirmation-popup'
import { AuthorizationPopup } from 'components/popup/authorization-popup'
import { AuthorizationType } from 'components/authorization'

import { Form } from './components/form'
import { Providers } from './components/providers'
import { DeleteUserButton } from './components/delete-user-button'
import styles from './user-settings.module.scss'

const UserSettings: FC = () => {
  const { errorCode, user } = useAuth()

  const [isLoginAgainModalVisible, setLoginAgainModalVisible] = useState<boolean>(false)
  const [isAuthorizationModalVisible, setAuthorizationModalVisible] = useState<boolean>(false)

  const showLoginAgainModal = useCallback(() => setLoginAgainModalVisible(true), [])
  const closeLoginAgainModal = useCallback(() => setLoginAgainModalVisible(false), [])

  const showAuthorizationModal = useCallback(() => {
    setAuthorizationModalVisible(true)
    setLoginAgainModalVisible(false)
  }, [])
  const closeAuthorizationModal = useCallback(() => setAuthorizationModalVisible(false), [])

  useEffect(() => {
    if (errorCode === AuthErrorCodes.CREDENTIAL_TOO_OLD_LOGIN_AGAIN || errorCode === AuthErrorCodes.TOKEN_EXPIRED) {
      showLoginAgainModal()
    }
  }, [errorCode, showLoginAgainModal])

  return (
    <>
      <TopBarPortal>
        <BackToOrdersLink />
      </TopBarPortal>

      <div>
        <h1 className={styles.heading}>Мой аккаунт</h1>

        {!user?.isAnonymous && (
          <>
            <Form />
            <Providers />
          </>
        )}

        <hr className={styles.divider} />

        <DeleteUserButton />
      </div>

      <ConfirmationPopup
        isVisible={isLoginAgainModalVisible}
        onClose={closeLoginAgainModal}
        message="В целях безопасности повторно войдите в приложение."
        emoji="👮🏻‍♂️"
        actionsList={[
          <button type="button" className="btn btn-primary" onClick={showAuthorizationModal} key="delete">
            Войти
          </button>,
          <button type="button" className="btn btn-default" onClick={closeLoginAgainModal} key="cancel">
            Отмена
          </button>,
        ]}
      />

      {isAuthorizationModalVisible && (
        <AuthorizationPopup type={AuthorizationType.SIGN_IN} onClose={closeAuthorizationModal} />
      )}
    </>
  )
}

export default memo(UserSettings)
