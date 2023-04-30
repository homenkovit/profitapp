/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable max-lines */
import { FC, FormEvent, useState, useMemo, useRef, useEffect, memo, useCallback } from 'react'
import TextareaAutosize from 'react-textarea-autosize'

import { ReactComponent as IconErrorSmall } from 'assets/images/error-small.svg'

import { MONTHS } from 'global/constants'
import { encodeText, decodeText } from 'global/helpers'
import { useAuth } from 'contexts/auth-context'
import { useOrder, StoreOrder } from 'contexts/order-context'
import type { Order } from 'contexts/order-context'

import { Field } from './constants'
import styles from './order-item-form.module.scss'
import CloseConfirmationPopup from './components/close-confirmation-popup/close-confirmation-popup'

interface OrderItemFormProperties {
  data?: Order
  onClose: () => void
  className?: string
}

const REQUIRED_FIELDS = [Field.DESCRIPTION, Field.PRICE]

const OrderItemForm: FC<OrderItemFormProperties> = ({ data, onClose, className }) => {
  const { user } = useAuth()
  const { addOrder, editOrder } = useOrder()

  const currentYear = new Date().getFullYear()
  const yearsList = useMemo((): number[] => Array.from({ length: 6 }, (_, index) => currentYear + index), [currentYear])

  const [description, setDescription] = useState<string>(decodeText(data?.description) ?? '')
  const [isPermanent, setIsPermanent] = useState<boolean>(data?.isPermanent ?? false)
  const [year, setYear] = useState<number>(data?.year ?? currentYear)
  const [month, setMonth] = useState<number>(data?.month ?? new Date().getMonth())
  const [price, setPrice] = useState<number | undefined>(data?.price)
  const [errorMessage, setErrorMessage] = useState<string | undefined>()
  const [validationFields, setValidationFields] = useState<Set<string>>(new Set())
  const [isConfirmationPopupVisible, setConfirmationPopupVisible] = useState<boolean>(false)

  const openConfirmationPopup = (): void => setConfirmationPopupVisible(true)
  const closeConfirmationPopup = (): void => setConfirmationPopupVisible(false)

  const formReference = useRef<HTMLFormElement>(null)
  const fieldDescription = useRef<HTMLTextAreaElement>(null)
  const fieldPrice = useRef<HTMLInputElement>(null)

  const validateField = (field: HTMLTextAreaElement | HTMLInputElement | null): void => {
    if (field) {
      const validationFieldsObject = new Set(validationFields)

      if (field.value === '' || (field.name === 'price' && (Number.isNaN(field.value) || Number(field.value) <= 0))) {
        validationFieldsObject.add(field.name)
      } else {
        validationFieldsObject.delete(field.name)
      }

      setValidationFields(validationFieldsObject)
    }
  }

  const saveOrder = (): void => {
    ;[fieldDescription.current, fieldPrice.current].forEach((field) => validateField(field))

    const isFormInvalid = validationFields.size > 0
    if (isFormInvalid) {
      return
    }

    if (user) {
      const newOrder: Partial<StoreOrder> = {
        description: encodeText(description),
        isPermanent,
        price,
      }

      if (!isPermanent) {
        newOrder.month = month
        newOrder.year = year
      }

      if (data) {
        editOrder(data.id, newOrder).catch((error) => console.error(`Can't edit order for a reason: ${error}`))
      } else {
        const { uid } = user
        newOrder.uid = uid
        newOrder.isCompleted = false

        addOrder(newOrder as StoreOrder).catch((error) => console.error(`Can't add new order for a reason: ${error}`))
      }

      onClose()
    }
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    saveOrder()
  }

  const checkFormChanges = useCallback(
    (): boolean =>
      (decodeText(data?.description) ?? '') !== description ||
      data?.price !== price ||
      (data?.isPermanent ?? false) !== isPermanent ||
      (data?.month ?? new Date().getMonth()) !== month ||
      (data?.year ?? currentYear) !== year,
    [
      data?.description,
      data?.isPermanent,
      data?.month,
      data?.price,
      data?.year,
      currentYear,
      description,
      isPermanent,
      month,
      price,
      year,
    ],
  )

  const onCloseConfirmationPopupYes = (): void => {
    saveOrder()
    closeConfirmationPopup()
  }

  const onCloseConfirmationPopupNo = (): void => {
    closeConfirmationPopup()
    onClose()
  }

  useEffect(() => {
    const form = formReference.current

    const formKeyDownEventHandler = (event: KeyboardEvent): void => {
      if (['Escape', 'Esc'].includes(event.key)) {
        const isFormChanged = checkFormChanges()
        if (isFormChanged) {
          openConfirmationPopup()
        } else {
          onClose()
        }
      }
    }

    form?.addEventListener('keydown', formKeyDownEventHandler)

    return () => {
      form?.removeEventListener('keydown', formKeyDownEventHandler)
    }
  }, [checkFormChanges, formReference, onClose])

  useEffect(() => {
    if (validationFields.size === REQUIRED_FIELDS.length) {
      setErrorMessage('Вы не заполнили поля')
    } else if (validationFields.has(Field.DESCRIPTION)) {
      setErrorMessage('Вы забыли указать описание заказа')
    } else if (validationFields.has(Field.PRICE)) {
      setErrorMessage('Вы забыли указать стоимость заказа')
    } else {
      setErrorMessage(undefined)
    }
  }, [validationFields])

  return (
    <>
      <form ref={formReference} className={`${styles.form} ${className}`} onSubmit={onSubmit}>
        <div className={styles['form-content']}>
          <fieldset className={`${styles.fieldset} ${styles.description}`}>
            <label className={styles.label} htmlFor={Field.DESCRIPTION}>
              Описание заказа
            </label>
            <TextareaAutosize
              className={`${styles.field} ${validationFields.has(Field.DESCRIPTION) ? styles.invalid : ''}`}
              name={Field.DESCRIPTION}
              id={Field.DESCRIPTION}
              value={description}
              ref={fieldDescription}
              placeholder="Введите описание заказа"
              onChange={(event): void => setDescription(event.target.value)}
              onBlur={(): void => validateField(fieldDescription.current)}
              maxRows={6}
              autoFocus
            />
          </fieldset>
          <fieldset className={`${styles.fieldset} ${styles.price}`}>
            <label className={styles.label} htmlFor={Field.PRICE}>
              Стоимость заказа (руб.)
            </label>
            <input
              className={`${styles.field} ${validationFields.has(Field.PRICE) ? styles.invalid : ''}`}
              type="number"
              id={Field.PRICE}
              name={Field.PRICE}
              defaultValue={price}
              placeholder="Введите стоимость заказа (руб.)"
              min={1}
              ref={fieldPrice}
              onChange={(event): void => setPrice(Number(event.target.value))}
              onBlur={(): void => validateField(fieldPrice.current)}
            />
          </fieldset>
          {!data && (
            <fieldset className={`${styles.fieldset} ${styles.type}`}>
              <p className={styles['label-radio']}>Тип заказа</p>
              <div className={styles['order-type-wrapper']}>
                <input
                  className={`${styles.radio} visually-hidden`}
                  type="radio"
                  id="single"
                  name="type"
                  value="single"
                  checked={!isPermanent}
                  onChange={(): void => setIsPermanent(!isPermanent)}
                />
                <label htmlFor="single">разовый</label>
                <input
                  className={`${styles.radio} visually-hidden`}
                  type="radio"
                  id="permanent"
                  name="type"
                  value="permanent"
                  checked={isPermanent}
                  onChange={(): void => setIsPermanent(!isPermanent)}
                />
                <label htmlFor="permanent">постоянный</label>
              </div>
            </fieldset>
          )}
          {!isPermanent && (
            <div className={styles['month-year-wrapper']}>
              <fieldset className={`${styles.fieldset} ${styles.month}`}>
                <label className={styles['label-select']} htmlFor="month">
                  Месяц оплаты
                </label>
                <div className={styles['select-wrapper']}>
                  <select
                    className={styles.select}
                    name="month"
                    id="month"
                    value={month}
                    onChange={(event): void => setMonth(Number(event.target.value))}
                  >
                    {MONTHS.map((monthString, monthIndex) => (
                      <option key={monthString} value={monthIndex}>
                        {monthString}
                      </option>
                    ))}
                  </select>
                </div>
              </fieldset>
              <fieldset className={`${styles.fieldset} ${styles.year}`}>
                <label className={styles['label-select']} htmlFor="year">
                  Год
                </label>
                <div className={styles['select-wrapper']}>
                  <select
                    className={styles.select}
                    name="year"
                    id="year"
                    value={year}
                    onChange={(event): void => setYear(Number(event.target.value))}
                  >
                    {yearsList.map((yearFromList) => (
                      <option key={yearFromList} value={yearFromList}>
                        {yearFromList}
                      </option>
                    ))}
                  </select>
                </div>
              </fieldset>
            </div>
          )}
        </div>
        <div className={styles['form-footer']}>
          {errorMessage && (
            <div className={styles['validate-error']}>
              <IconErrorSmall className={styles['error-icon']} />
              <p className={styles.message}>{errorMessage}</p>
            </div>
          )}
          <div className={styles.buttons}>
            <button className={`btn btn-primary ${styles.submit}`} type="submit">
              {data ? 'Изменить' : 'Добавить'}
            </button>
            <button className="btn btn-default" type="reset" onClick={onClose}>
              Отменить
            </button>
          </div>
        </div>
      </form>
      <CloseConfirmationPopup
        isVisible={isConfirmationPopupVisible}
        onClose={closeConfirmationPopup}
        onClickYes={onCloseConfirmationPopupYes}
        onClickNo={onCloseConfirmationPopupNo}
      />
    </>
  )
}

export default memo(OrderItemForm)
