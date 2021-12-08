import React, { FC, useEffect, useLayoutEffect, useState } from 'react';
import { ReactComponent as IcExpand } from '../../assets/images/expand.svg';
import { useAuth } from '../../contexts/auth-context';
import styles from '../greeting-message/greeting-message.module.scss';

const LOCAL_STORAGE_IS_GREETING_COLLAPSED = 'isGreetingCollapsed';

export const GreetingMessage: FC = () => {
  const { user } = useAuth();
  const [expanded, setExpanded] = useState<boolean>(true);

  useLayoutEffect(() => {
    const collapsedFromLocalStorage = localStorage.getItem(LOCAL_STORAGE_IS_GREETING_COLLAPSED);
    if (collapsedFromLocalStorage) {
      setExpanded(false);
    } else {
      setExpanded(true);
    }
  }, []);

  useEffect(() => {
    if (user) {
      const collapsedFromLocalStorage = localStorage.getItem(LOCAL_STORAGE_IS_GREETING_COLLAPSED);
      if (expanded && collapsedFromLocalStorage) {
        localStorage.removeItem(LOCAL_STORAGE_IS_GREETING_COLLAPSED);
      } else {
        localStorage.setItem(LOCAL_STORAGE_IS_GREETING_COLLAPSED, 'true');
      }
    }
  }, [expanded]);

  if (!user || !user.isAnonymous) {
    return null;
  }

  return (
    <div className={styles.greeting}>
      <h1 className="visually-hidden">Вы находитесь в режиме анонимного пользователя</h1>
      <button
        className={styles['expand-button']}
        onClick={() => setExpanded(expanded ? false : true)}
      >
        <p className={styles['header-text']}>Вы находитесь в режиме анонимного пользователя</p>
        <IcExpand className={`${styles['expand-icon']} ${expanded ? styles.expanded : ''}`} />
      </button>
      {expanded && (
        <p className={styles.description}>Добро пожаловать, коллега! Если ты находишься в данном режиме - значит либо разлогинился, либо еще не до конца представляешь, чем может помочь тебе данное приложение. Ничего сверхествественного мы не написали. Это просто удобный сервис, помогающей тебе держать в одном месте информацию о своих клиентах с возможностью оценивать свой ежемесячный доход. Некий ToDo лист для фрилансера.</p>
      )}
      <div className={styles['auth-buttons']}>
        <button className="btn btn-primary">
          Войти
        </button>
        <button className="btn btn-default">
          Зарегистрироваться
        </button>
      </div>
    </div>
  )
}
