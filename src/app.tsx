import { FC, useCallback, useState } from 'react'

import { useAuth } from './contexts/auth-context'
import { Header } from './components/header'
import { OrderList } from './components/order-list'
import { SortBar } from './components/sort-bar'
import { OrderItemForm } from './components/order-item'
import { GreetingMessage } from './components/greeting-message'
import { TopBarRightActions } from './components/top-bar-right-actions'
import { UnverifiedEmailMessage } from './components/unverified-email-message'
import './base.css'
import './resources/styles/modules.scss'
import styles from './app.module.scss'

const App: FC = () => {
  const { user } = useAuth()

  const [isNewOrderFormVisible, setNewOrderFormVisible] = useState<boolean>(false)

  const createNewOrder = (): void => {
    if (!isNewOrderFormVisible) {
      setNewOrderFormVisible(true)
    }
  }

  const handleOrderFormClose = useCallback((): void => setNewOrderFormVisible(false), [])

  return (
    <div className={styles.app}>
      <Header createNewOrder={createNewOrder} />
      <main>
        <div className={styles['top-bar']}>
          <SortBar />
          <TopBarRightActions />
        </div>
        <UnverifiedEmailMessage />
        {user && user.isAnonymous && <GreetingMessage />}
        {isNewOrderFormVisible && <OrderItemForm className={styles.form} onClose={handleOrderFormClose} />}
        <OrderList />
      </main>
    </div>
  )
}

export default App
