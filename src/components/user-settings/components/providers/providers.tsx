import { FC, memo, useMemo } from 'react'

import IconGoogle from 'assets/images/google.svg?react'

import { useAuth } from 'contexts/auth-context'

import styles from './providers.module.scss'

const Providers: FC = () => {
  const { user, signUpWithGoogle } = useAuth()

  const providers = useMemo(
    () => user?.providerData.map(({ providerId }) => providerId).filter((provider) => provider !== 'password'),
    [user?.providerData],
  )

  if (!providers || providers?.length !== 0) return null

  return (
    <>
      <h2 className={styles.heading}>Подключить провайдеры</h2>

      <ul className={styles['service-buttons-list']}>
        <li className={styles['service-buttons-item']}>
          <button type="button" className={styles['service-button']} aria-label="Google" onClick={signUpWithGoogle}>
            <IconGoogle aria-hidden />
          </button>
        </li>
      </ul>
    </>
  )
}

export default memo(Providers)
