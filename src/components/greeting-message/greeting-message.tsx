import React, { FC, ReactElement, useState } from 'react';
import { ReactComponent as IcExpand } from '../../assets/images/expand.svg';
import styles from '../greeting-message/greeting-message.module.scss';

export interface GreetingMessageProps {
  isVisible: boolean;
}

export const GreetingMessage: FC<GreetingMessageProps> = (props): null | ReactElement => {
  const [isExpand, setIsExpand] = useState<boolean>(true);

  if (!props.isVisible) {
    return null;
  }

  return (
    <div className={styles.greeting}>
      <button
        className={styles['expand-button']}
        onClick={() => setIsExpand(isExpand ? false : true)}
      >
        <IcExpand className={`${styles['expand-icon']} ${isExpand ? styles.expanded : ''}`} />
      </button>
      <h1 className={styles['header-text']}>Вы находитесь в режиме анонимного пользователя</h1>
      {isExpand && (
        <div className={styles.description}>
          <p className={styles['description-text']}>Добро пожаловать, коллега! Если ты находишься в данном режиме - значит либо разлогинился, либо еще не до конца представляешь, чем может помочь тебе данное приложение. Ничего сверхествественного мы не написали. Это просто удобный сервис, помогающей тебе держать в одном месте информацию о своих клиентах с возможностью оценивать свой ежемесячный доход. Некий ToDo лист для фрилансера.</p>
          <div className={styles['auth-buttons']}>
            <button>
              Войти
            </button>
            <button>
              Зарегистрироваться
            </button>
          </div>
        </div>
      )}
    </div>
  )
}