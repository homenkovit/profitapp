import React, { FC } from 'react';
import { ReactComponent as IconLogout } from '../../assets/images/logout.svg';
import { SettingsMenu } from '../popover/settings-menu/settings-menu';
import styles from './top-bar-right-actions.module.scss';

export const TopBarRightActions: FC = () => (
  <div className={styles['top-bar-right-actions']}>
    <SettingsMenu />
    <a href='#' aria-label='logout' className={styles.logout}>
      <IconLogout aria-hidden />
    </a>
  </div>
);
