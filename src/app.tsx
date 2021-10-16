import React, { useState } from 'react';
import { Header } from './components/header/header';
import { OrderList } from './components/order-list/order-list';
import { SortBar } from './components/sort-bar/sort-bar';
import { ReactComponent as IconSettings } from './assets/images/settings.svg';
import { ReactComponent as IconLogout } from './assets/images/logout.svg';
import { Order, user } from './mocks';
import { OrderItemForm } from './components/order-item/order-item-form';
import { GreetingMessage } from './components/greeting-message/greeting-message';
import './base.css';
import './resources/styles/modules.scss';
import styles from './app.module.scss';

const App = () => {
  const [isNewOrderFormVisible, setNewOrderFormVisible] = useState(false);

  const newOrderStub: Order = {
    id: Math.random().toString(),
    description: '',
    isPermanent: false,
    price: 0,
  };

  const createNewOrder = () => {
    if (!isNewOrderFormVisible) {
      setNewOrderFormVisible(true);
    }
  };

  return (
    <div className={styles.app}>
      <Header user={user} createNewOrder={createNewOrder} />
      <main>
        <div className={styles['top-bar']}>
          <SortBar />
          <button type='button' aria-label='settings' className={styles['settings-button']}>
            <IconSettings aria-hidden />
          </button>
          <a href='#' aria-label='logout' className={styles.logout}>
            <IconLogout aria-hidden />
          </a>
        </div>
        { /* TODO: add visibility by auth and onLogIn / onRegister methods */ }
        <GreetingMessage
          isVisible
          onLogIn={() => {}}
          onRegister={() => {}}
        />
        {isNewOrderFormVisible && <OrderItemForm data={newOrderStub} onClose={() => setNewOrderFormVisible(false)} />}
        <OrderList />
      </main>
    </div>
  );
};

export default App;
