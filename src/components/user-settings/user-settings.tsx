import { FC, memo } from 'react'

import { useAuth } from 'contexts/auth-context'
import { TopBarPortal } from 'components/top-bar'
import { BackToOrdersLink } from 'components/back-to-orders-link'

import { DeleteUserButton } from './components/delete-user-button'
import styles from './user-settings.module.scss'
import { Providers } from './components/providers'
import { Form } from './components/form'

const UserSettings: FC = () => {
  const { user } = useAuth()

  return (
    <>
      <TopBarPortal>
        <BackToOrdersLink />
      </TopBarPortal>

      <div>
        <h1 className={styles.heading}>Мой аккаунт</h1>

        {!user?.isAnonymous && (
          <>
            <Form />
            <Providers />
          </>
        )}

        <hr className={styles.divider} />

        <DeleteUserButton />
      </div>
    </>
  )
}

export default memo(UserSettings)
