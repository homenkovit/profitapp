import { FC, memo, ReactNode } from 'react'

import { Popup } from '../popup'

import styles from './confirmation-popup.module.scss'

interface ConfirmationPopupProperties {
  message: string
  actionsList: ReactNode[]
  emoji: string
  isVisible: boolean
  onClose: () => void
}

const ConfirmationPopup: FC<ConfirmationPopupProperties> = ({ message, actionsList, emoji, isVisible, onClose }) => (
  <Popup isVisible={isVisible} onClose={onClose}>
    <div className={styles.body}>
      <div className={styles.icon}>{emoji}</div>
      <div className={styles.message}>{message}</div>
    </div>
    <div className={styles.footer}>{actionsList}</div>
  </Popup>
)

export default memo(ConfirmationPopup)
