import { FC, memo } from 'react'
import { NavLink } from 'react-router-dom'

import { ReactComponent as IconClock } from 'assets/images/clock.svg'
import { ReactComponent as IconMoon } from 'assets/images/moon.svg'

import styles from './settings-menu-content.module.scss'

interface SettingsMenuContentProperties {
  onHistoryClick: () => void
  // onDarkModeClick: () => void
}

const SettingsMenuContent: FC<SettingsMenuContentProperties> = ({ onHistoryClick }) => {
  return (
    <ul role="menu" className={styles['menu-list']}>
      <li role="menuitem" className={styles['menu-item']}>
        <NavLink to="/history" className={styles['menu-item-button']} onClick={onHistoryClick}>
          <IconClock className={styles.icon} />
          История заказов
        </NavLink>
      </li>
      {/* TODO: Add theme change */}
      {/* <li role="menuitem" className={styles['menu-item']}>
        <button type="button" className={styles['menu-item-button']} onClick={onDarkModeClick}>
          <IconMoon className={styles.icon} />
          Темная тема
        </button>
      </li> */}
    </ul>
  )
}

export default memo(SettingsMenuContent)
