import React, { FC } from 'react';
import styles from './delete-order-popup-content.module.scss';

export interface DeleteOrderPopupContentProps {
  onDeleteBtnClick: () => void;
  onCancelBtnClick: () => void;
}

export const DeleteOrderPopupContent: FC<DeleteOrderPopupContentProps> = (props) => (
  <>
    <div className={styles.body}>
      <div className={styles.icon}>😧</div>
      <div className={styles.message}>Вы уверены, что хотите удалить заказ?</div> 
    </div>
    <div className={styles.footer}>
      <button className="btn btn-delete" onClick={props.onDeleteBtnClick}>Удалить</button>
      <button className="btn btn-default" onClick={props.onCancelBtnClick}>Ой, стоп!</button>
    </div>
  </>
);