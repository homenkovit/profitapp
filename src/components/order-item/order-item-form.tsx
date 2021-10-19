import React, { FC, FormEvent, useState } from 'react';
import { MONTHS } from '../../utils';
import { useAuth } from '../../contexts/auth-context';
import { useOrder, Order, StoreOrder } from '../../contexts/order-context';
import styles from './order-item-form.module.css';

interface OrderItemFormProps {
  data?: Order;
  onClose: () => void;
}

export const OrderItemForm: FC<OrderItemFormProps> = ({ data, onClose }) => {
  const { user } = useAuth();
  const { addOrder, editOrder } = useOrder();
  const [description, setDescription] = useState<string>(data?.description ?? '');
  const [isPermanent, setIsPermanent] = useState<boolean>(data?.isPermanent ?? false);
  const [month, setMonth] = useState<string>(data?.month ?? MONTHS[0]);
  const [price, setPrice] = useState<number>(data?.price ?? 0);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (user) {
      const newOrder: Partial<StoreOrder> = {
        description,
        isPermanent,
        price,
      };

      if (!isPermanent) {
        newOrder.month = month;
      }

      if (data) {
        editOrder(data.id, newOrder)
          .then(() => onClose())
          .catch((reason) => console.error(`Can't edit order for a reason: ${reason}`));
      } else {
        const { uid } = user;
        newOrder.uid = uid;
        newOrder.isCompleted = false;

        addOrder(newOrder as StoreOrder)
          .then(() => onClose())
          .catch((reason) => console.error(`Can't add new order for a reason: ${reason}`));
      }
    }
  };

  return (
    <form className={styles.form} action='' onSubmit={onSubmit}>
      <fieldset className={`${styles.fieldset} ${styles.description}`}>
        <label className={styles.label} htmlFor='description'>
          Описание заказа
        </label>
        <textarea
          className={styles.field}
          name='description'
          id='description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </fieldset>
      <fieldset className={`${styles.fieldset} ${styles.type}`}>
        <p className={styles.label}>Тип заказа</p>
        <input
          className={styles.radio}
          type='radio'
          id='permanent'
          name='type'
          value='permanent'
          checked={isPermanent}
          onChange={(e) => setIsPermanent(!isPermanent)}
        />
        <label htmlFor='permanent'>постоянный</label>
        <input
          className={styles.radio}
          type='radio'
          id='single'
          name='type'
          value='single'
          checked={!isPermanent}
          onChange={(e) => setIsPermanent(!isPermanent)}
        />
        <label htmlFor='single'>разовый</label>
      </fieldset>
      {!isPermanent && (
        <fieldset className={`${styles.fieldset} ${styles.month}`}>
          <label className={styles.label} htmlFor='month'>
            Месяц оплаты
          </label>
          <select className={styles.select} name='month' id='month' value={month} onChange={(e) => setMonth(e.target.value)}>
            {MONTHS.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </fieldset>
      )}
      <fieldset className={`${styles.fieldset} ${styles.price}`}>
        <label className={styles.label} htmlFor='price'>
          Стоимость заказа (руб.)
        </label>
        <input
          className={styles.field}
          type='number'
          id='price'
          name='price'
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
      </fieldset>
      <div className={styles.buttons}>
        <button className={styles.submit} type='submit'>
          {data ? 'Изменить' : 'Добавить'}
        </button>
        <button className={styles.reset} type='reset' onClick={() => onClose()}>
          Отменить
        </button>
      </div>
    </form>
  );
};