import React, { FC, useState, useRef, useLayoutEffect } from 'react';
import { OrderItemForm } from './order-item-form';
import { ReactComponent as IconPermanent } from '../../assets/images/permanent.svg';
import { ReactComponent as IconComplete } from '../../assets/images/complete-small.svg';
import { ReactComponent as IconEdit } from '../../assets/images/edit-small.svg';
import { ReactComponent as IconDelete } from '../../assets/images/delete-small.svg';
import { ReactComponent as IcExpand } from '../../assets/images/expand.svg';
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
  const [isDescriptionExpand, setIsDescriptionExpand] = useState<boolean>(false);
  const [isExpandBtnVisible, setExpandBtnVisible] = useState<boolean>(false);

  const descriptionRef = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const description = descriptionRef.current;
    if (description && !isDescriptionExpand) {
      if (description.offsetWidth < description.scrollWidth) {
        setExpandBtnVisible(true);
      } else {
        setExpandBtnVisible(false);
      }
    }
  }, [data.description]);

  if (isForm) {
    return <OrderItemForm data={data} onClose={() => setIsForm(false)} />;
  }

  return (
    <>
      <div className={`${styles.card} ${data.isPermanent ? styles.permanent : styles.single}`}>
        {isExpandBtnVisible ? (
          <button
            type='button'
            aria-label='expand'
            className={styles['expand-button']}
            onClick={() => setIsDescriptionExpand(!isDescriptionExpand)}
          >
            <div className={`${styles.description} ${isDescriptionExpand ? styles['full-text'] : ''}`}>
              {decodeText(data.description)}
            </div>
            <IcExpand
              className={`${styles['expand-icon']} ${isDescriptionExpand ? styles.expanded : ''}`}
              aria-hidden
            />
          </button>) : (
          <p
            className={styles.description}
            ref={descriptionRef}
          >
            {decodeText(data.description)}
          </p>
        )}
        <div className={styles['last-row']}>
          <strong className={styles.price}>{data.price} ₽</strong>
          {data.isPermanent
            ? <IconPermanent aria-label='permanent' className={styles['permanent-icon']} />
            : data.month !== undefined && <mark className={styles.month}>{MONTHS[data.month]}</mark>}
        </div>
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
