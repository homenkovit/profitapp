import { FC, memo } from 'react'

import { TOP_BAR_PORTAL_ID } from './components/top-bar-portal'
import { TopBarRightActions } from './components/top-bar-right-actions'
import styles from './top-bar.module.scss'

const TopBar: FC = () => {
  return (
    <div id="top-bar" className={styles['top-bar']}>
      <TopBarRightActions />
      <div id={TOP_BAR_PORTAL_ID} className={styles['top-bar-content']} />
    </div>
  )
}

export default memo(TopBar)
