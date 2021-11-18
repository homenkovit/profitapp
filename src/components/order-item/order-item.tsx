import React, { FC, useState } from 'react';
import { OrderItemForm } from './order-item-form';
import { ReactComponent as IconPermanent } from '../../assets/images/permanent.svg';
import { ReactComponent as IconComplete } from '../../assets/images/complete-small.svg';
import { ReactComponent as IconEdit } from '../../assets/images/edit-small.svg';
import { ReactComponent as IconDelete } from '../../assets/images/delete-small.svg';
import { DeleteOrderPopup } from '../popup/delete-order-popup/delete-order-popup';
import { useOrder, Order } from '../../contexts/order-context';
import { CompleteOrderPopup } from '../popup/complete-order-popup/complete-order-popup';
import styles from './order-item.module.scss';
import { MONTHS } from '../../utils';
import { decodeText } from './order-item-form-utils';

interface OrderItemProps {
  data: Order;
}

export const OrderItem: FC<OrderItemProps> = ({ data }) => {
  const { completeOrder, deleteOrder } = useOrder();
  const [isForm, setIsForm] = useState<boolean>(false);
  const [isDeletePopupVisible, setDeletePopupVisible] = useState<boolean>(false);
  const [isCompletePopupVisible, setCompletePopupVisible] = useState<boolean>(false);

  if (isForm) {
    return <OrderItemForm data={data} onClose={() => setIsForm(false)} />;
  }

  return (
    <>
      <div className={`${styles.card} ${data.isPermanent ? styles.permanent : styles.single}`}>
        <p className={styles.description}>{decodeText(data.description)}</p>
        <strong className={styles.price}>{data.price} ₽</strong>
        {data.isPermanent
          ? <IconPermanent aria-label='permanent' className={styles['permanent-icon']} />
          : data.month !== undefined && <mark className={styles.month}>{MONTHS[data.month]}</mark>}
        <ul className={styles.actions}>
          <li>
            <button type='button' aria-label='complete' onClick={() => setCompletePopupVisible(true)}>
              <IconComplete aria-hidden />
            </button>
          </li>
          <li>
            <button type='button' aria-label='edit' onClick={() => setIsForm(true)}>
              <IconEdit aria-hidden />
            </button>
          </li>
          <li>
            <button type='button' aria-label='delete' onClick={() => setDeletePopupVisible(true)}>
              <IconDelete aria-hidden />
            </button>
          </li>
        </ul>
      </div>
      <CompleteOrderPopup
        isVisible={isCompletePopupVisible}
        onComplete={() => {
          completeOrder(data.id)
            .catch((reason) => console.error(`Can't complete order for a reason: ${reason}`));
        }}
        onCancel={() => setCompletePopupVisible(false)}
      />
      <DeleteOrderPopup
        isVisible={isDeletePopupVisible}
        onDelete={() => {
          deleteOrder(data.id)
            .catch((reason) => console.error(`Can't delete order for a reason: ${reason}`));
        }}
        onCancel={() => setDeletePopupVisible(false)}
      />
    </>
  );
};
