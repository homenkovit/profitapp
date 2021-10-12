import React, { FC, ReactNode } from 'react';
import styles from './confirmation-popup.module.scss';

export interface ConfirmationPopupProps {
  message: string;
  actionsList: ReactNode[];
  emoji: string;
}

const COMPLETE_ORDER_ICON = "🎉";
const DELETE_ORDER_ICON = "😧";

export const ConfirmationPopup: FC<ConfirmationPopupProps> = (props) => (
  <>
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
  </>
);
