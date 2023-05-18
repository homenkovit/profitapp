import { FC, memo, useCallback, useMemo, useState } from 'react'

import { ReactComponent as IconLogout } from 'assets/images/logout.svg'

import { useAuth } from 'contexts/auth-context'
import { useOrder } from 'contexts/order-context'
import { AuthorizationPopup } from 'components/popup/authorization-popup'
import { AuthorizationType } from 'components/authorization'

import { LogoutWarningPopup } from './components/logout-warning-popup'
import styles from './logout-button.module.scss'

const LogoutButton: FC = () => {
  const { user, signOut } = useAuth()
  const { orders } = useOrder()

  const [isLogoutPopupVisible, setLogoutPopupVisible] = useState<boolean>(false)
  const [isSignUpPopupVisible, setSignUpPopupVisible] = useState<boolean>(false)

  const ordersAmount = useMemo(() => orders.length, [orders])

  const openLogoutPopup = useCallback(() => setLogoutPopupVisible(true), [])
  const closeLogoutPopup = useCallback(() => setLogoutPopupVisible(false), [])

  const openSignUpPopup = useCallback(() => {
    closeLogoutPopup()
    setSignUpPopupVisible(true)
  }, [closeLogoutPopup])
  const closeSignUpPopup = useCallback(() => setSignUpPopupVisible(false), [])

  const handleLogoutButtonClick = useCallback((): void => {
    if ((user?.isAnonymous || !user?.emailVerified) && ordersAmount > 0) {
      openLogoutPopup()
      return
    }
    signOut()
  }, [user, ordersAmount, openLogoutPopup, signOut])

  return (
    <>
      <button
        type="button"
        aria-label="logout"
        className={`menu-btn ${styles.logout}`}
        onClick={handleLogoutButtonClick}
      >
        <IconLogout aria-hidden />
      </button>

      <LogoutWarningPopup
        isVisible={isLogoutPopupVisible}
        onClose={closeLogoutPopup}
        onCancel={closeLogoutPopup}
        onSignUp={openSignUpPopup}
      />

      {isSignUpPopupVisible && <AuthorizationPopup type={AuthorizationType.SIGN_UP} onClose={closeSignUpPopup} />}
    </>
  )
}

export default memo(LogoutButton)
