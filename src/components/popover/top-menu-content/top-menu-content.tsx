import React, { FC } from 'react';
import { ReactComponent as IconClock } from '../../../assets/images/clock.svg';
import { ReactComponent as IconMoon } from '../../../assets/images/moon.svg';
import styles from './top-menu-content.module.scss';

export interface TopMenuContentProps {
  onHistoryClick: () => void;
  onDarkModeClick: () => void;
};

export const TopMenuContent: FC<TopMenuContentProps> = (props) => {
  return (
    <ul role="menu" className={styles['menu-list']}>
      <li role="menuitem" key="history" className={styles['menu-item']}>
        <button
          className={styles['menu-item-button']}
          onClick={props.onHistoryClick}
          aria-label="open screen with orders history"
        >
          <IconClock className={styles.icon} />
          История заказов
        </button>
      </li>
      <li role="menuitem" key="dark-mode" className={styles['menu-item']}>
        <button
          className={styles['menu-item-button']}
          onClick={props.onDarkModeClick}
          aria-label="switch color theme mode"
        >
          <IconMoon className={styles.icon} />
          Темная тема
        </button>
      </li>
    </ul>
  );
}
