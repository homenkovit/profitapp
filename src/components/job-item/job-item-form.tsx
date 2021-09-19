import React, { FC } from 'react';
import { Job } from '../../mocks';
import styles from './job-item-form.module.css';
import { MONTHS } from '../../utils';

interface JobItemFormProps {
  data: Job;
}

export const JobItemForm: FC<JobItemFormProps> = ({ data }) => {
  return (
    <form className={styles.form} action=''>
      <fieldset className={`${styles.fieldset} ${styles.description}`}>
        <label className={styles.label} htmlFor='description'>
          Описание заказа
        </label>
        <textarea className={styles.field} name='description' id='description' cols={30} rows={10} value={data.description}></textarea>
      </fieldset>
      <fieldset className={`${styles.fieldset} ${styles.type}`}>
        <p className={styles.label}>Тип заказа</p>
        <input className={styles.radio} type='radio' id='permanent' name='type' value='permanent' checked={data.isPermanent} />
        <label htmlFor='permanent'>постоянный</label>
        <input className={styles.radio} type='radio' id='single' name='type' value='single' checked={!data.isPermanent} />
        <label htmlFor='single'>разовый</label>
      </fieldset>
      {!data.isPermanent && (
        <fieldset className={`${styles.fieldset} ${styles.month}`}>
          <label className={styles.label} htmlFor='month'>
            Месяц оплаты
          </label>
          <select className={styles.select} name='month' id='month'>
            {MONTHS.map((month, index) => (
              <option key={month} value='index + 1' selected={month === data.month}>
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
        <input className={styles.field} type='text' id='price' name='price' value={data.price} />
      </fieldset>
      <div className={styles.buttons}>
        <button className={styles.submit} type='submit'>
          Добавить
        </button>
        <button className={styles.reset} type='reset'>
          Отменить
        </button>
      </div>
    </form>
  );
};
