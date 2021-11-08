import React, { FC, FormEvent, useState, useMemo } from 'react';
import { MONTHS } from '../../utils';
import { useAuth } from '../../contexts/auth-context';
import { useOrder, Order, StoreOrder } from '../../contexts/order-context';
import styles from './order-item-form.module.scss';

interface OrderItemFormProps {
  data?: Order;
  onClose: () => void;
  className?: string;
}

export const OrderItemForm: FC<OrderItemFormProps> = ({ data, onClose, className }) => {
  const { user } = useAuth();
  const { addOrder, editOrder } = useOrder();
  const [description, setDescription] = useState<string>(data?.description ?? '');
  const [isPermanent, setIsPermanent] = useState<boolean>(data?.isPermanent ?? false);
  const [year, setYear] = useState<number>(data?.year ?? new Date().getFullYear());
  const [month, setMonth] = useState<number>(data?.month ?? new Date().getMonth());
  const [price, setPrice] = useState<number>(data?.price ?? 0);

  let yearsList: number[] = [];
	yearsList = useMemo((): number[] => {
    for (let i = new Date().getFullYear(); i <= new Date().getFullYear() + 5; i++) {
      yearsList.push(i);
    }
    return yearsList;
	}, [new Date().getFullYear()]);

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
        newOrder.year = year;
      }

      if (data) {
        editOrder(data.id, newOrder)
          .catch((reason) => console.error(`Can't edit order for a reason: ${reason}`));
      } else {
        const { uid } = user;
        newOrder.uid = uid;
        newOrder.isCompleted = false;

        addOrder(newOrder as StoreOrder)
          .catch((reason) => console.error(`Can't add new order for a reason: ${reason}`));
      }

      onClose();
    }
  };

  return (
    <form className={`${styles.form} ${className}`} action='' onSubmit={onSubmit}>
      <div className={styles['row-order-title']}>
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
            placeholder="Введите описание заказа"
          ></textarea>
        </fieldset>
      </div>
      <div className={styles['row-order-options']}>
        <fieldset className={`${styles.fieldset} ${styles.price} ${!isPermanent ? styles.fixed : ''}`}>
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
            min={0}
          />
        </fieldset>
        <fieldset className={`${styles.fieldset} ${styles.type}`}>
          <p className={`${styles.label} ${styles['label-radio']}`}>Тип заказа</p>
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
        {!isPermanent && (<>
          <fieldset className={`${styles.fieldset} ${styles.month}`}>
            <label className={`${styles.label} ${styles['label-select']}`} htmlFor='month'>
              Месяц оплаты
            </label>
            <select className={styles.select} name='month' id='month' value={month} onChange={(e) => setMonth(Number(e.target.value))}>
              {MONTHS.map((monthString, monthIndex) => (
                <option key={monthString} value={monthIndex}>
                  {monthString}
                </option>
              ))}
            </select>
          </fieldset>
          <fieldset className={`${styles.fieldset} ${styles.year}`}>
            <label className={`${styles.label} ${styles['label-select']}`} htmlFor='year'>
              Год
            </label>
            <select className={styles.select} name='year' id='year' value={year} onChange={(e) => setYear(Number(e.target.value))}>
              {yearsList.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </fieldset>
        </>)}
      </div>
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
