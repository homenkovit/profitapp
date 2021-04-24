import React, { FC } from 'react';
import { Job } from '../../mocks';

const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

interface JobItemFormProps {
  data: Job;
}

export const JobItemForm: FC<JobItemFormProps> = ({ data }) => {
  return (
    <form action=''>
      <p>
        <label htmlFor='description'>Описание заказа</label>
      </p>
      <textarea name='description' id='description' cols={30} rows={10} value={data.description}></textarea>
      <p>Выберите тип заказа</p>
      <label htmlFor='permanent'>постоянный</label>
      <input type='radio' id='permanent' name='type' value='permanent' checked={data.isPermanent} />
      <label htmlFor='single'>разовый</label>
      <input type='radio' id='single' name='type' value='single' checked={!data.isPermanent} />
      {!data.isPermanent && (
        <>
          <p>
            <label htmlFor='month'>Месяц оплаты</label>
          </p>
          <select name='month' id='month'>
            {MONTHS.map((month, index) => (
              <option key={month} value='index + 1' selected={month === data.month}>
                {month}
              </option>
            ))}
          </select>
        </>
      )}
      <p>
        <label htmlFor='price'>Стоимость заказа (руб.)</label>
      </p>
      <input type='text' id='price' name='price' value={data.price} />
      <span>- разовые платежи</span>
      <span>- ежемесячные платежи</span>
      <button type='submit'>Добавить</button>
      <button type='reset'>Отменить</button>
    </form>
  );
};
