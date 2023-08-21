/* eslint-disable max-lines */
import { FC, FormEvent, memo, useEffect, useState } from 'react'

import { ReactComponent as IconError } from 'assets/images/error.svg'

import { useAuth } from 'contexts/auth-context'

import styles from './form.module.scss'

const Form: FC = () => {
  const { errorMessage, user, changeName, changePassword } = useAuth()

  const [name, setName] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [repeatPassword, setRepeatPassword] = useState<string>('')
  const [error, setError] = useState<string | undefined>(undefined)

  useEffect(() => {
    setError(errorMessage)
  }, [errorMessage])

  const onSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault()

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

      changePassword(newPassword)
      setPassword('')
      setRepeatPassword('')
      setError(undefined)
    }
  }

  return (
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
          className={styles.field}
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
          className={styles.field}
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
  )
}

export default memo(Form)
