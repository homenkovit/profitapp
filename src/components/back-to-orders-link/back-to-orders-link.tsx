import { FC, memo } from 'react'
import { NavLink } from 'react-router-dom'

import IconArrowLeft from 'assets/images/arrow-left.svg?react'

import { useIsMobile } from 'hooks/use-is-mobile'

import styles from './back-to-orders-link.module.scss'

const BackToOrdersLink: FC = () => {
  const isMobile = useIsMobile()

  return (
    <NavLink to="/" className={styles.link}>
      {isMobile && <IconArrowLeft aria-hidden />}
      <span className={isMobile ? 'visually-hidden' : ''}>← обратно к заказчикам</span>
    </NavLink>
  )
}

export default memo(BackToOrdersLink)
