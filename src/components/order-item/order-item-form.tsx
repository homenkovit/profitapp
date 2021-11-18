import React, { FC, FormEvent, useState, useMemo, useRef } from 'react';
import { MONTHS } from '../../utils';
import { useAuth } from '../../contexts/auth-context';
import { useOrder, Order, StoreOrder } from '../../contexts/order-context';
import { ReactComponent as IconErrorSmall } from '../../assets/images/error-small.svg';
import { encodeText, decodeText, onKeyDown, onPaste, Field, ValidationFields } from './order-item-form-utils';
import styles from './order-item-form.module.scss';

interface OrderItemFormProps {
  data?: Order;
  onClose: () => void;
  className?: string;
}

export const OrderItemForm: FC<OrderItemFormProps> = ({ data, onClose, className }) => {
  const { user } = useAuth();
  const { addOrder, editOrder } = useOrder();

  const [description, setDescription] = useState<string>(decodeText(data?.description) ?? '');
  const [isPermanent, setIsPermanent] = useState<boolean>(data?.isPermanent ?? false);
  const [year, setYear] = useState<number>(data?.year ?? new Date().getFullYear());
  const [month, setMonth] = useState<number>(data?.month ?? new Date().getMonth());
  const [price, setPrice] = useState<number | undefined>(data?.price ?? undefined);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [validationFields, setValidationFields] = useState<ValidationFields>({
    isDescriptionInvalid: false,
    isPriceInvalid: false,
  });

  const fieldDescription = useRef<HTMLTextAreaElement | null>(null);
  const fieldPrice = useRef<HTMLInputElement | null>(null);

  let yearsList: number[] = [];
	yearsList = useMemo((): number[] => {
    for (let i = new Date().getFullYear(); i <= new Date().getFullYear() + 5; i++) {
      yearsList.push(i);
    }
    return yearsList;
	}, [new Date().getFullYear()]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    validateFields([fieldDescription.current, fieldPrice.current]);

    const isFormInvalid = Object.values(validationFields).find(value => value);
    if (isFormInvalid) {
      return;
    };

    if (user) {
      const newOrder: Partial<StoreOrder> = {
        description: encodeText(description),
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

  const validateFields = (fields: (HTMLTextAreaElement | HTMLInputElement | null)[]) => {
    let validationFieldsObject = validationFields;

    fields.forEach(field => {
      if (field) {
        if (field.name === Field.DESCRIPTION) {
          if (field.value === '') {
            validationFieldsObject.isDescriptionInvalid = true;
          } else {
            validationFieldsObject.isDescriptionInvalid = false;
          }
        } else if (field.name === Field.PRICE) {
          if (field.value === '') {
            validationFieldsObject.isPriceInvalid = true;
          } else {
            validationFieldsObject.isPriceInvalid = false;
          }
        }
      } 
    })

    if (validationFieldsObject.isPriceInvalid && validationFieldsObject.isDescriptionInvalid) {
      setErrorMessage('Вы не заполнили поля');
    } else if (validationFieldsObject.isDescriptionInvalid) {
      setErrorMessage('Вы забыли указать описание заказа');
    } else if (validationFieldsObject.isPriceInvalid) {
      setErrorMessage('Вы забыли указать стоимость заказа');
    } else {
      setErrorMessage(undefined);
    }
 
    setValidationFields(validationFieldsObject);
  }

  return (
    <form className={`${styles.form} ${className}`} action='' onSubmit={onSubmit}>
      <fieldset className={`${styles.fieldset} ${styles.description}`}>
        <label className={styles.label} htmlFor='description'>
          Описание заказа
        </label>
        <textarea
          className={`${styles.field} ${validationFields.isDescriptionInvalid ? styles.invalid : ''}`}
          name={Field.DESCRIPTION}
          id={Field.DESCRIPTION}
          value={description}
          ref={fieldDescription}
          placeholder="Введите описание заказа"
          onChange={(e) => setDescription(e.target.value)}
          onBlur={(e) => validateFields([fieldDescription.current])}
        ></textarea>
      </fieldset>
      <div className={styles['row-order-options']}>
        <fieldset className={`${styles.fieldset} ${styles.price}`}>
          <label className={styles.label} htmlFor='price'>
            Стоимость заказа (руб.)
          </label>
          <input
            className={`${styles.field} ${validationFields.isPriceInvalid ? styles.invalid : ''}`}
            type='number'
            id={Field.PRICE}
            name={Field.PRICE}
            defaultValue={price}
            placeholder='Введите стоимость заказа (руб.)'
            min={0}
            ref={fieldPrice}
            onChange={(e) => setPrice(Number(e.target.value))}
            onBlur={(e) => validateFields([fieldPrice.current])}
            onKeyDown={onKeyDown}
            onPaste={onPaste}
          />
        </fieldset>
        {!data && (
          <fieldset className={`${styles.fieldset} ${styles.type}`}>
            <p className={styles['label-radio']}>Тип заказа</p>
            <input
              className={styles.radio}
              type='radio'
              id='permanent'
              name='type'
              value='permanent'
              checked={isPermanent}
              onChange={() => setIsPermanent(!isPermanent)}
            />
            <label htmlFor='permanent'>постоянный</label>
            <input
              className={styles.radio}
              type='radio'
              id='single'
              name='type'
              value='single'
              checked={!isPermanent}
              onChange={() => setIsPermanent(!isPermanent)}
            />
            <label htmlFor='single'>разовый</label>
          </fieldset>) 
        }
        {!isPermanent && (
          <div className={styles['month-year-wrapper']}>
            <fieldset className={`${styles.fieldset} ${styles.month}`}>
              <label className={styles['label-select']} htmlFor='month'>
                Месяц оплаты
              </label>
              <select
                className={styles.select}
                name='month'
                id='month'
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
              >
                {MONTHS.map((monthString, monthIndex) => (
                  <option key={monthString} value={monthIndex}>
                    {monthString}
                  </option>
                ))}
              </select>
            </fieldset>
            <fieldset className={`${styles.fieldset} ${styles.year}`}>
              <label className={styles['label-select']} htmlFor='year'>
                Год
              </label>
              <select
                className={styles.select}
                name='year'
                id='year'
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              >
                {yearsList.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </fieldset>
          </div>)
        }
      </div>
      <div className={styles['footer-form']}>
        {errorMessage && <div className={styles['validate-error']}>
          <IconErrorSmall className={styles['error-icon']} /> 
          <p className={styles.message}>{ errorMessage }</p>
        </div>}
        <div className={styles.buttons}>
          <button
            className={`${styles.submit}`}
            type='submit'
          >
            {data ? 'Изменить' : 'Добавить'}
          </button>
          <button className={styles.reset} type='reset' onClick={() => onClose()}>
            Отменить
          </button>
        </div>
      </div>
    </form>
  );
};
