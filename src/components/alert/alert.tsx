import React, { FC, ReactElement } from 'react';
import { ReactComponent as IcClose } from '../../assets/images/close.svg';
import styles from './alert.module.scss';

export enum AlertType {
  INFO = "info",
}

export interface AlertProps {
  isVisible: boolean;
  type: AlertType;
  onClose: () => void;
}

export const Alert: FC<AlertProps> = (props): null | ReactElement => {
  if (!props.isVisible) {
    return null;
  }

  return (
    <div className={[styles.alert, styles[`${AlertType.INFO}`]].join(' ')}>
      <button
        className={styles['close-button']}
        onClick={props.onClose}
      >
        <IcClose />
      </button>
      {props.children}
    </div>
  )
};