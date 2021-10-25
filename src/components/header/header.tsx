import React, { FC } from 'react';
import { useAuth } from '../../contexts/auth-context';
import { ReactComponent as IconLogo } from '../../assets/images/logo.svg';
import { ReactComponent as IconFooter } from '../../assets/images/footer.svg';
import styles from './header.module.scss';
import { Statistics } from '../statistics/statistics';

interface HeaderProps {
  createNewOrder: () => void;
}

export const Header: FC<HeaderProps> = ({ createNewOrder }) => {
  const { user } = useAuth();
  return (
    <header className={styles.header}>
      <h1 className='visually-hidden'>ProfitApp</h1>
      <IconLogo className={styles.logo} aria-label='Profit App logo' />
      {user && (
        <p className={styles.greeting}>
          {user.isAnonymous
            ? 'Режим анонимного пользователя'
            : <>Привет, <span>{user.displayName}</span>. Хорошего тебе дня!</>}
        </p>
      )}
      <button type='button' className={styles['add-new-order-button']} onClick={createNewOrder}>
        Новый заказ
      </button>
      <Statistics />
      <IconFooter aria-hidden className={styles['mobile-footer-icon']} />
    </header>
  );
};
