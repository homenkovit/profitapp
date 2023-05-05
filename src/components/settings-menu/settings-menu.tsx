import { FC, memo, useRef } from 'react'
// eslint-disable-next-line import/no-extraneous-dependencies
import { Instance } from 'tippy.js'

import { ReactComponent as IconSettings } from 'assets/images/settings.svg'

import { Popover } from 'components/popover'

import { SettingsMenuContent } from './components/settings-menu-content'
import styles from './settings-menu.module.scss'

export interface SettingsMenuProperties {
  className?: string
}

export const SettingsMenu: FC<SettingsMenuProperties> = ({ className }) => {
  const popoverReference = useRef<Instance>()

  const onHistoryButtonClick = (): void => {
    popoverReference.current?.hide()
  }

  // const onDarkModeButtonClick = (): void => {
  //   popoverReference.current?.hide()
  //   /* TODO: Add theme mode button click handler */
  // }

  return (
    <Popover
      role="menu"
      onMount={(instance): void => {
        popoverReference.current = instance
      }}
      content={<SettingsMenuContent onHistoryClick={onHistoryButtonClick} />}
    >
      <button
        type="button"
        aria-label="open settings menu"
        aria-haspopup="true"
        aria-expanded
        className={`menu-btn ${styles['settings-button']} ${className ?? ''}`}
      >
        <IconSettings aria-hidden />
      </button>
    </Popover>
  )
}

export default memo(SettingsMenu)
