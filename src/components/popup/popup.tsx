import React, { FC, ReactElement } from 'react';
import { createPopupContainer } from '../utils/create-popup-container';
import styles from './popup.module.scss';

export interface PopupProps {
  isVisible: boolean;
  className?: string;
};

export const Popup: FC<PopupProps> = (props) => {
  if (!props.isVisible) {
    return null;
  }

  const dialog: ReactElement = (
    <div className={styles.overlay}>
      <div className={`${styles['popup-dialog']} ${props.className}`}>
        {props.children}
      </div>
    </div>
  );

  return createPopupContainer(dialog);
};
