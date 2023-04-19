import { FC, memo } from 'react'

import { ReactComponent as IconSpinner } from 'assets/images/spinner.svg'

import styles from './page-loader.module.scss'

const PageLoader: FC = () => {
  return (
    <div className={styles.loader}>
      <IconSpinner className={styles.spinner} />
    </div>
  )
}

export default memo(PageLoader)
