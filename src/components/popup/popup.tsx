import { FC, ReactNode, useEffect, useRef } from 'react'

import { FocusLock } from 'components/focus-lock'

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
  const activeElement = useRef<HTMLElement>()
  const reference = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = reference.current

    if (isVisible) {
      activeElement.current = document.activeElement as HTMLElement
      dialog?.showModal()
    } else {
      dialog?.close()
      activeElement.current?.focus()
    }

    dialog?.addEventListener('close', onClose)

    return (): void => {
      dialog?.removeEventListener('close', onClose)
    }
  }, [onClose, isVisible])

  if (!isVisible) {
    return null
  }

  return (
    <dialog ref={reference} className={`${styles['popup-dialog']} ${className ?? ''}`} style={{ width, height }}>
      <FocusLock>{children}</FocusLock>
    </dialog>
  )
}
