import React, { useState } from 'react';
import { useAuth } from './contexts/auth-context';
import { Header } from './components/header/header';
import { OrderList } from './components/order-list/order-list';
import { SortBar, SortType } from './components/sort-bar/sort-bar';
import { OrderItemForm } from './components/order-item/order-item-form';
import { GreetingMessage } from './components/greeting-message/greeting-message';
import { TopBarRightActions } from './components/top-bar-right-actions/top-bar-right-actions';
import { LOCAL_STORAGE_SORT_KEY } from './components/sort-bar/sort-bar';
import './base.css';
import './resources/styles/modules.scss';
import styles from './app.module.scss';

const App = () => {
  const { user } = useAuth();
  const [isNewOrderFormVisible, setNewOrderFormVisible] = useState(false);
  const [sortType, setSortType] = useState<SortType>(() => {
    return localStorage.getItem(LOCAL_STORAGE_SORT_KEY) as SortType || SortType.DATE
  });

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
          <SortBar onSortChange={setSortType} />
          <TopBarRightActions />
        </div>
        { /* TODO: add onLogIn / onRegister methods */ }
        <GreetingMessage
          isVisible={user?.isAnonymous ?? false}
          onLogIn={() => {}}
          onRegister={() => {}}
        />
        {isNewOrderFormVisible && <OrderItemForm className={styles.form} onClose={() => setNewOrderFormVisible(false)} />}
        <OrderList sortType={sortType} />
      </main>
    </div>
  );
};

export default App;
