import { FC, useCallback, useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from 'contexts/auth-context'
import { usePrevious } from 'hooks/use-previous'
import { Header } from 'components/header'
import { OrderItemForm } from 'components/order-item'
import { GreetingMessage } from 'components/greeting-message'
import { UnverifiedEmailMessage } from 'components/unverified-email-message'
import { TopBar } from 'components/top-bar'

import styles from './app.module.scss'

const App: FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const previousLocation = usePrevious(location)

  const [isNewOrderFormVisible, setNewOrderFormVisible] = useState<boolean>(false)

  useEffect(() => {
    if (location.pathname !== previousLocation.pathname) {
      document.querySelector('body')?.scroll({ top: 0, behavior: 'smooth' })

      if (location.pathname !== '/') {
        setNewOrderFormVisible(false)
      }
    }
  }, [location, previousLocation])

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
        <Outlet />
      </main>
    </div>
  )
}

export default App
