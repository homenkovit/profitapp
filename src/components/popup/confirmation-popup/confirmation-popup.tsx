import React, { FC, ReactNode } from 'react';
import { Popup } from '../popup';
import styles from './confirmation-popup.module.scss';

export interface ConfirmationPopupProps {
  message: string;
  actionsList: ReactNode[];
  emoji: string;
  isVisible: boolean;
}

export const ConfirmationPopup: FC<ConfirmationPopupProps> = (props) => (
  <Popup isVisible={props.isVisible}>
    <div className={styles.body}>
      <div className={styles.icon}>
        {props.emoji}
      </div>
      <div className={styles.message}>
        {props.message}
      </div> 
    </div>
    <div className={styles.footer}>
      {props.actionsList}
    </div>
  </Popup>
);
