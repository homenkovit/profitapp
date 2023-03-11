import { FC, memo } from 'react'

import { useAuth } from '../../../../contexts/auth-context'
import { useIsMobile } from '../../../../hooks/use-is-mobile'
import { ReactComponent as IcLogoForDesktop } from '../../../../assets/images/logo-without-bg.svg'
import { ReactComponent as IcLogoForMobile } from '../../../../assets/images/logo.svg'

import styles from './anonymous.module.scss'

const Anonymous: FC = () => {
  const { signInAnonymously } = useAuth()
  const isMobile = useIsMobile()

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {isMobile ? <IcLogoForMobile /> : <IcLogoForDesktop />}
        <h1 className={styles.head}>
          <strong>ProfitApp</strong> - инструмент контроля заказов для фрилансера
        </h1>
      </div>
      <button type="button" className={styles.button} onClick={signInAnonymously}>
        Режим анонимного пользователя
      </button>
    </div>
  )
}

export default memo(Anonymous)
