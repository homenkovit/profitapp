/* eslint-disable max-lines */
import { FC, FormEvent, memo, useCallback, useEffect, useState } from 'react'

import IconError from 'assets/images/error.svg?react'

import { useAuth } from 'contexts/auth-context'
import { ConfirmationPopup } from 'components/popup/confirmation-popup'

import styles from './form.module.scss'

const Form: FC = () => {
  const { errorMessage, user, changeName, changePassword } = useAuth()

  const [isModalVisible, setModalVisible] = useState<boolean>(false)

  const openModal = useCallback(() => setModalVisible(true), [])
  const closeModal = useCallback(() => setModalVisible(false), [])

  const [name, setName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [repeatPassword, setRepeatPassword] = useState<string>('')
  const [error, setError] = useState<string | undefined>(undefined)

  useEffect(() => {
    setError(errorMessage)
  }, [errorMessage])

  const onChange = useCallback(() => {
    closeModal()

    changePassword(password.trim())

    setPassword('')
    setRepeatPassword('')
  }, [changePassword, closeModal, password])

  const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()
    setError(undefined)

    const newName = name.trim()
    const newPassword = password.trim()
    const newRepeatPassword = repeatPassword.trim()

    if (newName && newName !== user?.displayName) {
      changeName(newName)
      setName('')
    }

    if (newPassword) {
      if (newPassword !== newRepeatPassword) {
        setError(newRepeatPassword ? 'Пароли не совпадают' : 'Пожалуйста, подтвердите пароль')
        return
      }

      openModal()
    }
  }

  return (
    <>
      <form method="post" onSubmit={onSubmit} className={styles.form}>
        <label htmlFor="name" className={styles.label}>
          Изменить имя
          <input
            type="text"
            id="name"
            className={styles.field}
            placeholder="Введите новое имя"
            name="name"
            value={name}
            onChange={(event): void => setName(event.currentTarget.value)}
          />
        </label>

        <label htmlFor="password" className={styles.label}>
          Сменить пароль
          <input
            type="password"
            id="password"
            className={`${styles.field} ${error === undefined ? '' : styles.invalid}`}
            placeholder="Введите новый пароль"
            name="password"
            value={password}
            onChange={(event): void => setPassword(event.currentTarget.value)}
          />
        </label>

        <label htmlFor="password" className={styles.label}>
          Подтвердить пароль
          <input
            type="password"
            id="repeat-password"
            className={`${styles.field} ${error === undefined ? '' : styles.invalid}`}
            placeholder="Подтвердите новый пароль"
            name="repeat-password"
            value={repeatPassword}
            required={Boolean(password.trim())}
            onChange={(event): void => setRepeatPassword(event.currentTarget.value)}
          />
        </label>

        {error && (
          <p className={styles.error}>
            <IconError aria-hidden />
            {error}
          </p>
        )}

        <button type="submit" className={`btn btn-primary ${styles.save}`}>
          Сохранить
        </button>
      </form>

      <ConfirmationPopup
        isVisible={isModalVisible}
        onClose={closeModal}
        message="Ваш пароль будет изменен. Продолжим?"
        emoji="🔑"
        actionsList={[
          <button type="button" className="btn btn-danger" onClick={onChange} key="delete">
            Изменить
          </button>,
          <button type="button" className="btn btn-default" onClick={closeModal} key="cancel">
            Отмена
          </button>,
        ]}
      />
    </>
  )
}

export default memo(Form)
