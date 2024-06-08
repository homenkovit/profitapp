import { FC, memo } from 'react'

import IconLogoForDesktop from 'assets/images/logo-without-bg.svg?react'
import containerBackgroundImage from 'assets/images/login-page-bg.png'

import { useAuth } from 'contexts/auth-context'
import { useIsMobile } from 'hooks/use-is-mobile'

import styles from './anonymous.module.scss'

const Anonymous: FC = () => {
  const { signInAnonymously } = useAuth()
  const isMobile = useIsMobile()

  return (
    <div className={styles.container} style={{ backgroundImage: `url(${containerBackgroundImage})` }}>
      {!isMobile && (
        <div className={styles.header}>
          <IconLogoForDesktop width={111} height={114} />
          <h1 className={styles.head}>
            <strong>ProfitApp</strong> - инструмент контроля заказов для фрилансера
          </h1>
        </div>
      )}
      <button type="button" className={styles.button} onClick={signInAnonymously}>
        Режим анонимного пользователя
      </button>
    </div>
  )
}

export default memo(Anonymous)
