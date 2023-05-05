import { FC, memo } from 'react'

import { ReactComponent as IconLogout } from 'assets/images/logout.svg'

import { useAuth } from 'contexts/auth-context'
import { SettingsMenu } from 'components/settings-menu'

import styles from './top-bar-right-actions.module.scss'

const TopBarRightActions: FC = () => {
  const { user, signOut } = useAuth()

  return (
    <div className={styles['top-bar-right-actions']}>
      <SettingsMenu />
      {user && !user.isAnonymous && (
        <button type="button" aria-label="logout" className={`menu-btn ${styles.logout}`} onClick={signOut}>
          <IconLogout aria-hidden />
        </button>
      )}
    </div>
  )
}

export default memo(TopBarRightActions)
