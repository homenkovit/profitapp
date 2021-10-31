import React, { useState } from 'react';
import { useAuth } from './contexts/auth-context';
import { Header } from './components/header/header';
import { OrderList } from './components/order-list/order-list';
import { SortBar } from './components/sort-bar/sort-bar';
import { OrderItemForm } from './components/order-item/order-item-form';
import { GreetingMessage } from './components/greeting-message/greeting-message';
import { TopBarRightActions } from './components/top-bar-right-actions/top-bar-right-actions';
import './base.css';
import './resources/styles/modules.scss';
import styles from './app.module.scss';

const App = () => {
  const { user } = useAuth();
  const [isNewOrderFormVisible, setNewOrderFormVisible] = useState(false);

  const createNewOrder = () => {
    if (!isNewOrderFormVisible) {
      setNewOrderFormVisible(true);
    }
  };

  return (
    <div className={styles.app}>
      <Header createNewOrder={createNewOrder} />
      <main>
        <div className={styles['top-bar']}>
          <SortBar />
          <TopBarRightActions />
        </div>
        { /* TODO: add onLogIn / onRegister methods */ }
        <GreetingMessage
          isVisible={user?.isAnonymous ?? false}
          onLogIn={() => {}}
          onRegister={() => {}}
        />
        {isNewOrderFormVisible && <OrderItemForm className={styles.form} onClose={() => setNewOrderFormVisible(false)} />}
        <OrderList />
      </main>
    </div>
  );
};

export default App;
