import { FC, memo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import IconLogoForMobile from 'assets/images/logo.svg?react'

import { useIsMobile } from 'hooks/use-is-mobile'

import { useAuth } from '../../contexts/auth-context'

import { Tabs } from './components/tabs'
import { Anonymous } from './components/anonymous'
import styles from './login.module.scss'

const Login: FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [navigate, user])

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {isMobile && (
          <div className={styles.header}>
            <IconLogoForMobile className={styles.logo} />
            <h1 className={styles.head}>
              <strong>ProfitApp</strong> - инструмент контроля заказов для фрилансера
            </h1>
          </div>
        )}
        <Tabs />
        <Anonymous />
      </div>
    </div>
  )
}

export default memo(Login)
