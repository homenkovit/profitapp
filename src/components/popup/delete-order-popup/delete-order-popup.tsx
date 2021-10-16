import React, { FC } from 'react';
import { ConfirmationPopup } from '../confirmation-popup/confirmation-popup';

export interface DeleteOrderPopupProps {
  onDelete: () => void;
  onCancel: () => void;
  isVisible: boolean;
}

export const DeleteOrderPopup: FC<DeleteOrderPopupProps> = (props) => {
  return (
    <ConfirmationPopup
      isVisible={props.isVisible}
      emoji="😧"
      message="Вы уверены, что хотите удалить заказ?"
      actionsList={[
        <button className="btn btn-danger" onClick={props.onDelete} key="delete">Удалить</button>,
        <button className="btn btn-default" onClick={props.onCancel} key="cancel">Ой, стоп!</button>
      ]}
    />
  )
};
