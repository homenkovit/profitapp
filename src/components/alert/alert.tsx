import { FC, ReactNode } from 'react'

import IconClose from '../../assets/images/close.svg?react'

import styles from './alert.module.scss'

export enum AlertType {
  INFO = 'info',
}

export interface AlertProperties {
  isVisible: boolean
  type: AlertType
  children: ReactNode
  onClose: () => void
}

export const Alert: FC<AlertProperties> = ({ isVisible, type, children, onClose }) => {
  if (!isVisible) {
    return null
  }

  return (
    <div className={`${styles.alert} ${styles[type]}`}>
      <button type="button" className={styles['close-button']} onClick={onClose} aria-label="Закрыть">
        <IconClose />
      </button>
      {children}
    </div>
  )
}
