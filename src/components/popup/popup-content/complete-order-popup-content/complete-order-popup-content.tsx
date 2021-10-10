import React, { FC } from 'react';
import styles from './complete-order-popup-content.module.scss';

export interface CompleteOrderPopupContentProps {
  onCompleteBtnClick: () => void;
  onCancelBtnClick: () => void;
}

export const CompleteOrderPopupContent: FC<CompleteOrderPopupContentProps> = (props) => (
  <>
    <div className={styles.body}>
      <div className={styles.icon}>🎉</div>
      <div className={styles.message}>Ну что же, судя по всему работа выполнена</div> 
    </div>
    <div className={styles.footer}>
      <button className="btn btn-complete" onClick={props.onCompleteBtnClick}>Готово</button>
      <button className="btn btn-default" onClick={props.onCancelBtnClick}>Погоди!</button>
    </div>
  </>
);