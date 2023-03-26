import { FC, memo } from 'react'

import { ReactComponent as IconClock } from '../../../../assets/images/clock.svg'
import { ReactComponent as IconMoon } from '../../../../assets/images/moon.svg'

import styles from './settings-menu-content.module.scss'

interface SettingsMenuContentProperties {
  onHistoryClick: () => void
  onDarkModeClick: () => void
}

const SettingsMenuContent: FC<SettingsMenuContentProperties> = ({ onHistoryClick, onDarkModeClick }) => {
  return (
    <ul role="menu" className={styles['menu-list']}>
      <li role="menuitem" className={styles['menu-item']}>
        <button type="button" className={styles['menu-item-button']} onClick={onHistoryClick}>
          <IconClock className={styles.icon} />
          История заказов
        </button>
      </li>
      <li role="menuitem" className={styles['menu-item']}>
        <button type="button" className={styles['menu-item-button']} onClick={onDarkModeClick}>
          <IconMoon className={styles.icon} />
          Темная тема
        </button>
      </li>
    </ul>
  )
}

export default memo(SettingsMenuContent)
