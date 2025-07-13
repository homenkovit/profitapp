import { FC, useCallback, useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from 'contexts/auth-context'
import { usePrevious } from 'hooks/use-previous'
import { Header } from 'components/header'
import { OrderItemForm } from 'components/order-item'
import { GreetingMessage } from 'components/greeting-message'
import { UnverifiedEmailMessage } from 'components/unverified-email-message'
import { TopBar } from 'components/top-bar'
import { ConfirmationPopup } from 'components/popup/confirmation-popup'

import styles from './app.module.scss'

const App: FC = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const previousLocation = usePrevious(location)

  const [isNewOrderFormVisible, setNewOrderFormVisible] = useState<boolean>(false)
  const [isGoToDemoModalVisible, setGoToModalVisible] = useState<boolean>(false)

  const openGoToDemoModal = useCallback((): void => setGoToModalVisible(true), [])
  const closeGoToDemoModal = useCallback((): void => {
    setGoToModalVisible(false)
    navigate('.', { replace: true })
  }, [navigate])

  const goToDemo = useCallback((): void => {
    closeGoToDemoModal()
    signOut()
    navigate('/?demo=true')
  }, [closeGoToDemoModal, navigate, signOut])

  useEffect(() => {
    if (!user) return

    if (location.search === '?demo=true') {
      if (user.isAnonymous) {
        navigate('.', { replace: true })
      } else {
        openGoToDemoModal()
      }
    }

    if (location.pathname !== previousLocation.pathname) {
      document.querySelector('body')?.scroll({ top: 0, behavior: 'smooth' })

      if (location.pathname !== '/') {
        setNewOrderFormVisible(false)
      }
    }
  }, [location, navigate, openGoToDemoModal, previousLocation, user])

  const closeNewOrderForm = useCallback((): void => setNewOrderFormVisible(false), [])

  const createNewOrder = useCallback((): void => {
    if (!isNewOrderFormVisible) {
      navigate('/')
      setNewOrderFormVisible(true)
    }
  }, [isNewOrderFormVisible, navigate])

  useEffect(() => {
    if (!user?.isAnonymous) {
      closeNewOrderForm()
    }
  }, [closeNewOrderForm, user])

  return (
    <div className={styles.app}>
      <Header createNewOrder={createNewOrder} />
      <main>
        <TopBar />
        <UnverifiedEmailMessage />
        {user && user.isAnonymous && <GreetingMessage />}
        {isNewOrderFormVisible && <OrderItemForm className={styles.form} onClose={closeNewOrderForm} />}
        <ConfirmationPopup
          isVisible={isGoToDemoModalVisible}
          message="Вы уже вошли в систему. Хотите перейти в режим анонимного пользователя?"
          emoji="🤔"
          onClose={closeGoToDemoModal}
          actionsList={[
            <button key="confirm" type="button" className="btn btn-primary" onClick={goToDemo}>
              Перейти
            </button>,
            <button key="cancel" type="button" className="btn btn-default" onClick={closeGoToDemoModal}>
              Отмена
            </button>,
          ]}
        />
        <Outlet />
      </main>
    </div>
  )
}

export default App
