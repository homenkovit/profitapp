import React, { FC, FormEvent, useState } from 'react';
import { Job } from '../../mocks';
import styles from './job-item-form.module.css';
import { MONTHS } from '../../utils';
import { getFirestore, query, collection, where, addDoc } from '@firebase/firestore';
import { useAuth } from '../../contexts/auth-context';

interface JobItemFormProps {
  data: Job;
  onClose: () => void;
}

export const JobItemForm: FC<JobItemFormProps> = ({ data, onClose }) => {
  const { user } = useAuth();
  const [description, setDescription] = useState<string>(data.description);
  const [isPermanent, setIsPermanent] = useState<boolean>(data.isPermanent);
  const [month, setMonth] = useState<string | undefined>(data.month ?? MONTHS[0]);
  const [price, setPrice] = useState<number>(data.price);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (user) {
      const { uid } = user;
      const db = getFirestore();

      addDoc(
        collection(db, 'jobs'),
        {
          description,
          isPermanent,
          month,
          price,
          uid,
        },
      ).then(() => onClose())
      .catch((reason) => console.error(`Can't add new job: ${reason}`));
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
          onChange={(e) => setIsPermanent(e.target.checked)}
        />
        <label htmlFor='permanent'>постоянный</label>
        <input
          className={styles.radio}
          type='radio'
          id='single'
          name='type'
          value='single'
          checked={!isPermanent}
          onChange={(e) => setIsPermanent(e.target.checked)}
        />
        <label htmlFor='single'>разовый</label>
      </fieldset>
      {!data.isPermanent && (
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
          type='text'
          id='price'
          name='price'
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
        />
      </fieldset>
      <div className={styles.buttons}>
        <button className={styles.submit} type='submit'>
          Добавить
        </button>
        <button className={styles.reset} type='reset' onClick={() => onClose()}>
          Отменить
        </button>
      </div>
    </form>
  );
};
