import React, { FC, FormEvent, useEffect, useState } from 'react';
import { ReactComponent as IcGoogle } from '../../assets/images/google.svg';
import { ReactComponent as IcError } from '../../assets/images/error.svg';
import { useAuth } from '../../contexts/auth-context';
import styles from './authorization.module.scss';

export enum AuthorizationType {
  SIGN_IN = 'sign-in',
  SIGN_UP = 'sign-up',
}

interface AuthorizationProps {
  type: AuthorizationType;
  onCancel?: () => void;
}

export const Authorization: FC<AuthorizationProps> = ({ type, onCancel }) => {
  const { authError, signUpWithEmail, signInWithEmail, signUpWithGoogle, signInWithGoogle, resetPassword } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [error, setError] = useState<string | undefined>(authError);

  useEffect(() => {
    setError(authError);
  }, [authError]);

  const isSignUp = type === AuthorizationType.SIGN_UP;

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget as HTMLFormElement);

    const name = formData.get('name')?.toString();
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();
    const passwordApprove = formData.get('passwordApprove')?.toString();

    if (email?.length && password?.length) {
      if (isSignUp) {
        if (password === passwordApprove && name) {
          signUpWithEmail(email, password, name);
        } else {
          setError('Пароль не совпадает');
          return;
        }
      } else {
        signInWithEmail(email, password);
      }

      setError(undefined);
      onCancel?.();
    }
  };

  const onResetPasswordButtonClick = () => {
    if (email) {
      resetPassword(email);
    } else {
      setError('Введите email');
    }
  };

  const onGoogleButtonClick = () => {
    if (isSignUp) {
      signUpWithGoogle();
    } else {
      signInWithGoogle();
    }

    onCancel?.();
  };
  
  return (
    <div className={styles.container}>
      <form onSubmit={onSubmit} className={styles.form}>
        {isSignUp && (
          <label htmlFor="name" className={styles.label}>
            <span className="visually-hidden">Введите имя</span>
            <input type="text" id="name" name="name" placeholder='Введите имя' className={styles.input} required />
          </label>
        )}
        <label htmlFor="email" className={styles.label}>
          <span className="visually-hidden">Введите email</span>
          <input
            type="email"
            id="email"
            name="email"
            placeholder='Введите email'
            className={styles.input}
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label htmlFor="password" className={styles.label}>
          <span className="visually-hidden">Введите пароль</span>
          <input type="password" id="password" name="password" placeholder='Введите пароль' className={styles.input} required />
        </label>
        {isSignUp && (
          <label htmlFor="passwordApprove" className={styles.label}>
            <span className="visually-hidden">Подтвердите пароль</span>
            <input type="password" id="passwordApprove" name="passwordApprove" placeholder='Подтвердите пароль' className={styles.input} required />
          </label>
        )}
        {error && (
          <p className={styles.error}>
            <IcError />
            {error}
          </p>
        )}
        <div className={styles['form-buttons']}>
          <button type="submit" className="btn btn-primary">{isSignUp ? 'Зарегистрироваться' : 'Войти'}</button>
          <button type="reset" className="btn btn-default" onClick={onCancel}>Отмена</button>
        </div>
        {!isSignUp && (
          <p className={styles['remember-text']}>
            <button type="button" className={styles['remember-button']} onClick={onResetPasswordButtonClick}>Сбросить</button> пароль (информация будет отправлена на ваш почтовый ящик)
          </p>
        )}
      </form>
      <p className={styles.separator}>или</p>
      <p className={styles['with-text']}>{isSignUp ? 'Зарегистрируйтесь' : 'Войдите'} с помощью:</p>
      <ul className={styles['services-buttons-list']}>
        <li className={styles['services-buttons-item']}>
          <button type="button" className={styles['service-button']} onClick={onGoogleButtonClick}>
            <IcGoogle aria-label="Google" />
          </button>
        </li>
      </ul>
    </div>
  );
};
