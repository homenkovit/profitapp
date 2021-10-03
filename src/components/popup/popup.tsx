import React, { FC, ReactNode, ReactElement } from 'react';
import { createPopupContainer } from '../utils/create-popup-container';
import styles from './popup.module.scss';

export interface PopupProps {
  isVisible: boolean;
  icon: string;
  message: string;
  actionsList: ReactNode[];
};

export const COMPLETE_ORDER_ICON = '🤞';
export const REMOVE_ORDER_ICON = '😧';

export const Popup: FC<PopupProps> = (props): null | ReactElement => {
  if (!props.isVisible) {
    return null;
  }

  const dialog: ReactElement = (
    <div className={styles.overlay}>
      <div className={styles['popup-dialog']}>
        <div className={styles.body}>
          <div className={styles.icon}>
            {props.icon}
          </div>
          <div className={styles.message}>
            {props.message}
          </div> 
        </div>
        <div className={styles.footer}>
          {props.actionsList}
        </div>
      </div>     
    </div>
  );

  return createPopupContainer(dialog);
};
