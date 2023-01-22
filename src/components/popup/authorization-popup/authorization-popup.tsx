import React, { FC } from 'react';
import { Popup } from '../popup';
import { ReactComponent as IcLogo } from '../../../assets/images/logo.svg';
import styles from './authorization-popup.module.scss';
import { Authorization, AuthorizationType } from '../../authorization/authorization';

interface AuthorizationPopupProps {
  type: AuthorizationType;
  onClose: () => void;
}

export const AuthorizationPopup: FC<AuthorizationPopupProps> = ({ type, onClose }) => {
  return (
    <Popup isVisible className={styles.popup}>
      <header className={styles.header}>
        <h1 className={styles.h1}>
          <IcLogo className={styles.logo} />
          <span className={styles['app-name']}>PROFITAPP</span>
          <sub className={styles['app-version']}>1.0.0</sub>
        </h1>
        <h2 className={styles.h2}>Инструмент контроля заказов для фрилансера</h2>
      </header>
      <Authorization type={type} onCancel={onClose} />
    </Popup>
  );
};
