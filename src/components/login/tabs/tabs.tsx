import React, { ChangeEvent, useCallback, useState } from 'react';
import { Authorization, AuthorizationType } from '../../authorization/authorization';
import styles from './tabs.module.scss';

export const Tabs = () => {
  const [authType, setAuthType] = useState<AuthorizationType>(AuthorizationType.SIGN_IN);

  const onTabChange = useCallback((event: ChangeEvent<HTMLDivElement>) => {
    const nextAuthType = (event.target as HTMLInputElement).value as AuthorizationType;
    setAuthType(nextAuthType)
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.tabs} onChange={onTabChange}>
        <label htmlFor="sign-in" className={styles.tab}>
          Вход
          <input type="radio" id="sign-in" className="visually-hidden" name="auth-type" value={AuthorizationType.SIGN_IN} defaultChecked />
        </label>
        <label htmlFor="sign-up" className={styles.tab}>
          Регистрация
          <input type="radio" id="sign-up" className="visually-hidden" name="auth-type" value={AuthorizationType.SIGN_UP} />
        </label>
      </div>
      <Authorization type={authType} />
    </div>
  );
};
