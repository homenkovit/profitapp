import { FC, memo } from 'react'

import { SettingsMenu } from 'components/settings-menu'
import { LogoutButton } from 'components/logout-button'

import styles from './top-bar-right-actions.module.scss'

const TopBarRightActions: FC = () => {
  return (
    <div className={styles['top-bar-right-actions']}>
      <SettingsMenu />
      <LogoutButton />
    </div>
  )
}

export default memo(TopBarRightActions)
