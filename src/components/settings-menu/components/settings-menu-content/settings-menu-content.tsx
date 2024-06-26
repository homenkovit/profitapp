import { FC, memo } from 'react'
import { NavLink } from 'react-router-dom'

import IconClock from 'assets/images/clock.svg?react'
import IconUser from 'assets/images/user.svg?react'
// import IconMoon from 'assets/images/moon.svg?react'

import styles from './settings-menu-content.module.scss'

interface SettingsMenuContentProperties {
  onHistoryClick: () => void
  onUserClick: () => void
  // onDarkModeClick: () => void
}

const SettingsMenuContent: FC<SettingsMenuContentProperties> = ({ onHistoryClick, onUserClick }) => {
  return (
    <ul role="menu" className={styles['menu-list']}>
      <li role="menuitem" className={styles['menu-item']}>
        <NavLink to="/history" className={styles['menu-item-button']} onClick={onHistoryClick}>
          <IconClock className={styles.icon} />
          История заказов
        </NavLink>
      </li>
      <li role="menuitem" className={styles['menu-item']}>
        <NavLink to="/user" className={styles['menu-item-button']} onClick={onUserClick}>
          <IconUser className={styles.icon} />
          Мой аккаунт
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
