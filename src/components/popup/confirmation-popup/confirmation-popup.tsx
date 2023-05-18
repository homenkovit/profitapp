import { FC, memo, ReactNode } from 'react'

import { Popup } from '../popup'

import styles from './confirmation-popup.module.scss'

interface ConfirmationPopupProperties {
  message: string
  actionsList: ReactNode[]
  emoji: string
  isVisible: boolean
  width?: number | string
  height?: number | string
  onClose: () => void
}

const ConfirmationPopup: FC<ConfirmationPopupProperties> = ({
  message,
  actionsList,
  emoji,
  isVisible,
  width,
  height,
  onClose,
}) => (
  <Popup isVisible={isVisible} width={width} height={height} onClose={onClose}>
    <div className={styles.body}>
      <div className={styles.icon}>{emoji}</div>
      <div className={styles.message}>{message}</div>
    </div>
    <div className={styles.footer}>{actionsList}</div>
  </Popup>
)

export default memo(ConfirmationPopup)
