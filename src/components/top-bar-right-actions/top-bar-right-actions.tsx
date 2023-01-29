import React, { FC } from 'react';
import { ReactComponent as IconLogout } from '../../assets/images/logout.svg';
import { useAuth } from '../../contexts/auth-context';
import { SettingsMenu } from '../popover/settings-menu/settings-menu';
import styles from './top-bar-right-actions.module.scss';

export const TopBarRightActions: FC = () => {
  const { user, signOut } = useAuth();

  return (
    <div className={styles['top-bar-right-actions']}>
      <SettingsMenu />
      {user && !user.isAnonymous && (
        <button aria-label="logout" className={styles.logout} onClick={signOut}>
          <IconLogout aria-hidden />
        </button>
      )}
    </div>
  );
};
