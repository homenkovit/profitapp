import { FC, memo } from 'react'

import { Popup } from '../popup'
import IconLogo from '../../../assets/images/logo.svg?react'
import { Authorization, AuthorizationType } from '../../authorization'

import styles from './authorization-popup.module.scss'

interface AuthorizationPopupProperties {
  type: AuthorizationType
  onClose: () => void
}

const AuthorizationPopup: FC<AuthorizationPopupProperties> = ({ type, onClose }) => {
  return (
    <Popup isVisible className={styles.popup} onClose={onClose}>
      <header className={styles.header}>
        <h1 className={styles.h1}>
          <IconLogo className={styles.logo} />
          <span className={styles['app-name']}>PROFITAPP</span>
          <sub className={styles['app-version']}>1.0.0</sub>
        </h1>
        <h2 className={styles.h2}>Инструмент контроля заказов для фрилансера</h2>
      </header>
      <Authorization type={type} onCancel={onClose} />
    </Popup>
  )
}

export default memo(AuthorizationPopup)
