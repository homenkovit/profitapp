import { FC, ReactElement, ReactNode, useEffect, useRef } from 'react'
import ReactFocusLock from 'react-focus-lock'

import { createPopupContainer } from './helpers/create-popup-container'
import styles from './popup.module.scss'

export interface PopupProperties {
  isVisible: boolean
  children: ReactNode
  className?: string
  width?: number | string
  height?: number | string
  onClose: () => void
}

export const Popup: FC<PopupProperties> = ({ isVisible, children, className, width, height, onClose }) => {
  const popupReference = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isVisible) return undefined

    const popup = popupReference?.current

    const popupKeyDownHandler = (event: KeyboardEvent): void => {
      if (['Escape', 'Esc'].includes(event.key)) {
        onClose()
      }
    }

    popup?.addEventListener('keydown', popupKeyDownHandler)

    return () => {
      popup?.removeEventListener('keydown', popupKeyDownHandler)
    }
  }, [popupReference, onClose, isVisible])

  if (!isVisible) {
    return null
  }

  const dialog: ReactElement = (
    <div className={styles.overlay}>
      <div ref={popupReference} className={`${styles['popup-dialog']} ${className}`} style={{ width, height }}>
        <ReactFocusLock returnFocus>{children}</ReactFocusLock>
      </div>
    </div>
  )

  return createPopupContainer(dialog)
}
