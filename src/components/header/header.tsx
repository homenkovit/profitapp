import { FC, memo } from 'react'

import IconLogo from 'assets/images/logo.svg?react'

import { useAuth } from 'contexts/auth-context'
import { CreateOrderButton } from 'components/create-order-button'
import { Statistics } from 'components/statistics'

import styles from './header.module.scss'

interface HeaderProperties {
  createNewOrder: () => void
}

const Header: FC<HeaderProperties> = ({ createNewOrder }) => {
  const { user } = useAuth()

  return (
    <header className={styles.header}>
      <IconLogo className={styles.logo} aria-label="Profit App logo" />
      {user && (
        <p className={styles.greeting}>
          Привет
          {user.isAnonymous || !user.displayName ? (
            '.'
          ) : (
            <>
              ,{user.displayName.includes(' ') ? <br /> : ' '}
              <span>{user.displayName}</span>.
            </>
          )}
          <br />
          Хорошего тебе дня!
        </p>
      )}
      <CreateOrderButton onCreate={createNewOrder} />
      <Statistics />
    </header>
  )
}

export default memo(Header)
