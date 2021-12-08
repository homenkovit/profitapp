import React, { FC, FormEvent, useState, useMemo, useRef, useEffect } from 'react';
import { MONTHS } from '../../utils';
import { useAuth } from '../../contexts/auth-context';
import { useOrder, Order, StoreOrder } from '../../contexts/order-context';
import { ReactComponent as IconErrorSmall } from '../../assets/images/error-small.svg';
import { encodeText, decodeText, Field } from './order-item-form-utils';
import TextareaAutosize from 'react-textarea-autosize';
import styles from './order-item-form.module.scss';

interface OrderItemFormProps {
  data?: Order;
  onClose: () => void;
  className?: string;
}

const REQUIRED_FIELDS = [Field.DESCRIPTION, Field.PRICE];

export const OrderItemForm: FC<OrderItemFormProps> = ({ data, onClose, className }) => {
  const { user } = useAuth();
  const { addOrder, editOrder } = useOrder();

  const currentYear = useMemo(() => new Date().getFullYear(), [new Date().getFullYear()]);
  const yearsList = useMemo((): number[] => Array.from({length: 6}, (_, i) => currentYear + i), [currentYear]);

  const [description, setDescription] = useState<string>(decodeText(data?.description) ?? '');
  const [isPermanent, setIsPermanent] = useState<boolean>(data?.isPermanent ?? false);
  const [year, setYear] = useState<number>(data?.year ?? currentYear);
  const [month, setMonth] = useState<number>(data?.month ?? new Date().getMonth());
  const [price, setPrice] = useState<number | undefined>(data?.price ?? undefined);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [validationFields, setValidationFields] = useState<Set<string>>(new Set());

  const fieldDescription = useRef<HTMLTextAreaElement>(null);
  const fieldPrice = useRef<HTMLInputElement>(null);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    [fieldDescription.current, fieldPrice.current].forEach(validateField);

    const isFormInvalid = validationFields.size > 0;
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

  const validateField = (field: HTMLTextAreaElement | HTMLInputElement | null) => {
    if (field) {
      const validationFieldsObject = new Set(validationFields);

      if (field.value === '') {
        validationFieldsObject.add(field.name);
      } else if (validationFields.has(field.name)) {
        validationFieldsObject.delete(field.name);
      }

      setValidationFields(new Set(validationFieldsObject));
    }
  }

  useEffect(() => {
    if (validationFields.size === REQUIRED_FIELDS.length) {
      setErrorMessage('Вы не заполнили поля');
    } else if (validationFields.has(Field.DESCRIPTION)) {
      setErrorMessage('Вы забыли указать описание заказа');
    } else if (validationFields.has(Field.PRICE)) {
      setErrorMessage('Вы забыли указать стоимость заказа');
    } else {
      setErrorMessage(undefined);
    }
  }, [validationFields]);

  return (
    <form className={`${styles.form} ${className}`} action='' onSubmit={onSubmit}>
      <fieldset className={`${styles.fieldset} ${styles.description}`}>
        <label className={styles.label} htmlFor='description'>
          Описание заказа
        </label>
        <TextareaAutosize
          className={`${styles.field} ${validationFields.has(Field.DESCRIPTION) ? styles.invalid : ''}`}
          name={Field.DESCRIPTION}
          id={Field.DESCRIPTION}
          value={description}
          ref={fieldDescription}
          placeholder="Введите описание заказа"
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() => validateField(fieldDescription.current)}
          maxRows={6}
        />
      </fieldset>
      <fieldset className={`${styles.fieldset} ${styles.price}`}>
        <label className={styles.label} htmlFor='price'>
          Стоимость заказа (руб.)
        </label>
        <input
          className={`${styles.field} ${validationFields.has(Field.PRICE) ? styles.invalid : ''}`}
          type='number'
          id={Field.PRICE}
          name={Field.PRICE}
          defaultValue={price}
          placeholder='Введите стоимость заказа (руб.)'
          min={0}
          ref={fieldPrice}
          onChange={(e) => setPrice(Number(e.target.value))}
          onBlur={() => validateField(fieldPrice.current)}
        />
      </fieldset>
      {!data && (
        <fieldset className={`${styles.fieldset} ${styles.type}`}>
          <p className={styles['label-radio']}>Тип заказа</p>
          <input
            className={`${styles.radio} visually-hidden`}
            type='radio'
            id='single'
            name='type'
            value='single'
            checked={!isPermanent}
            onChange={() => setIsPermanent(!isPermanent)}
          />
          <label htmlFor='single'>разовый</label>
          <input
            className={`${styles.radio} visually-hidden`}
            type='radio'
            id='permanent'
            name='type'
            value='permanent'
            checked={isPermanent}
            onChange={() => setIsPermanent(!isPermanent)}
          />
          <label htmlFor='permanent'>постоянный</label>
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
        </div>
      )}
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
        <button className={styles.reset} type='reset' onClick={onClose}>
          Отменить
        </button>
      </div>
    </form>
  );
};
