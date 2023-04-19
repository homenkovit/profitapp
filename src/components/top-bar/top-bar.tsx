import { FC, memo } from 'react'

import { TOP_BAR_PORTAL_ID } from './components/top-bar-portal'
import { TopBarRightActions } from './components/top-bar-right-actions'
import styles from './top-bar.module.scss'

const TopBar: FC = () => {
  return (
    <div className={styles['top-bar']}>
      <div id={TOP_BAR_PORTAL_ID} className={styles['top-bar-content']} />
      <TopBarRightActions />
    </div>
  )
}

export default memo(TopBar)
