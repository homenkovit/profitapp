import { FC, memo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../../contexts/auth-context'

import { Tabs } from './components/tabs'
import { Anonymous } from './components/anonymous'
import styles from './login.module.scss'

const Login: FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [navigate, user])

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <Tabs />
        <Anonymous />
      </div>
    </div>
  )
}

export default memo(Login)
