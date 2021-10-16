import React, { FC } from 'react';
import { ConfirmationPopup } from '../confirmation-popup/confirmation-popup';

export interface CompleteOrderPopupProps {
  onComplete: () => void;
  onCancel: () => void;
  isVisible: boolean;
}

export const CompleteOrderPopup: FC<CompleteOrderPopupProps> = (props) => {
  return (
    <ConfirmationPopup
      isVisible={props.isVisible}
      emoji="🎉"
      message="Ну что же, судя по всему работа выполнена!"
      actionsList={[
        <button className="btn btn-primary" onClick={props.onComplete} key="complete">Готово</button>,
        <button className="btn btn-default" onClick={props.onCancel} key="cancel">Погоди!</button>
      ]}
    />
  )
};