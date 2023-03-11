import { FC, ReactElement, ReactNode } from 'react'

import { createPopupContainer } from '../utils/create-popup-container'

import styles from './popup.module.scss'

export interface PopupProperties {
  isVisible: boolean
  className?: string
  children: ReactNode
}

export const Popup: FC<PopupProperties> = ({ isVisible, className, children }) => {
  if (!isVisible) {
    return null
  }

  const dialog: ReactElement = (
    <div className={styles.overlay}>
      <div className={`${styles['popup-dialog']} ${className}`}>{children}</div>
    </div>
  )

  return createPopupContainer(dialog)
}
