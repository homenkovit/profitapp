/* eslint-disable max-lines */
import { FC, FormEvent, memo, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import IconGoogle from '../../assets/images/google.svg?react'
import IconError from '../../assets/images/error.svg?react'
import { useAuth } from '../../contexts/auth-context'

import styles from './authorization.module.scss'

export enum AuthorizationType {
  SIGN_IN = 'sign-in',
  SIGN_UP = 'sign-up',
}

interface AuthorizationProperties {
  type: AuthorizationType
  onCancel?: () => void
}

const Authorization: FC<AuthorizationProperties> = ({ type, onCancel }) => {
  const { pathname } = useLocation()
  const { errorMessage, signUpWithEmail, signInWithEmail, signUpWithGoogle, signInWithGoogle, resetPassword } =
    useAuth()
  const [emailValue, setEmail] = useState<string>('')
  const [error, setError] = useState<string | undefined>(errorMessage)

  const isLoginPage = pathname === '/login'

  useEffect(() => {
    setError(errorMessage)
  }, [errorMessage])

  const isSignUp = type === AuthorizationType.SIGN_UP

  const onSubmit = (event: FormEvent): void => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget as HTMLFormElement)

    const name = formData.get('name')?.toString().trim()
    const email = formData.get('email')?.toString().trim()
    const password = formData.get('password')?.toString().trim()
    const passwordApprove = formData.get('passwordApprove')?.toString().trim()

    if (email?.length && password?.length) {
      if (isSignUp) {
        if (password === passwordApprove) {
          signUpWithEmail(email, password, name)
        } else {
          setError('Пароль не совпадает')
          return
        }
      } else {
        signInWithEmail(email, password)
      }

      setError(undefined)
      onCancel?.()
    }
  }

  const onResetPasswordButtonClick = (): void => {
    if (emailValue) {
      resetPassword(emailValue)
    } else {
      setError('Введите email')
    }
  }

  const onGoogleButtonClick = (): void => {
    if (isSignUp) {
      signUpWithGoogle()
    } else {
      signInWithGoogle()
    }

    onCancel?.()
  }

  return (
    <div className={styles.container}>
      <form onSubmit={onSubmit} className={styles.form}>
        {isSignUp && (
          <label htmlFor="name" className={styles.label}>
            <span className="visually-hidden">Введите имя</span>
            <input type="text" id="name" name="name" placeholder="Введите имя" className={styles.input} />
          </label>
        )}
        <label htmlFor="email" className={styles.label}>
          <span className="visually-hidden">Введите email</span>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Введите email"
            className={styles.input}
            required
            value={emailValue}
            onChange={(event): void => setEmail(event.target.value)}
          />
        </label>
        <label htmlFor="password" className={styles.label}>
          <span className="visually-hidden">Введите пароль</span>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Введите пароль"
            className={styles.input}
            required
          />
        </label>
        {isSignUp && (
          <label htmlFor="passwordApprove" className={styles.label}>
            <span className="visually-hidden">Подтвердите пароль</span>
            <input
              type="password"
              id="passwordApprove"
              name="passwordApprove"
              placeholder="Подтвердите пароль"
              className={styles.input}
              required
            />
          </label>
        )}
        {error && (
          <p className={styles.error}>
            <IconError />
            {error}
          </p>
        )}
        <div className={styles['form-buttons']}>
          <button type="submit" className="btn btn-primary">
            {isSignUp ? 'Зарегистрироваться' : 'Войти'}
          </button>
          {!isLoginPage && (
            <button type="reset" className="btn btn-default" onClick={onCancel}>
              Отмена
            </button>
          )}
        </div>
        {!isSignUp && (
          <p className={styles['remember-text']}>
            <button type="button" className={styles['remember-button']} onClick={onResetPasswordButtonClick}>
              Сбросить
            </button>{' '}
            пароль (информация будет отправлена на ваш почтовый ящик)
          </p>
        )}
      </form>
      <p className={styles.separator}>или</p>
      <p className={styles['with-text']}>{isSignUp ? 'Зарегистрируйтесь' : 'Войдите'} с помощью:</p>
      <ul className={styles['services-buttons-list']}>
        <li className={styles['services-buttons-item']}>
          <button type="button" className={styles['service-button']} onClick={onGoogleButtonClick}>
            <IconGoogle aria-label="Google" />
          </button>
        </li>
      </ul>
    </div>
  )
}

export default memo(Authorization)
