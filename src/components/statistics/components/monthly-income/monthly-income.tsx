import { FC, memo } from 'react'

import { ChartMobile } from 'components/chart/chart-mobile'

import { useIsMobile } from '../../../../hooks/use-is-mobile'
import { ChartDesktop } from '../../../chart/chart-desktop'

import styles from './monthly-income.module.scss'

const MonthlyIncome: FC = () => {
  const isMobile = useIsMobile()

  return (
    <section id="chart-section" className={styles['chart-section']}>
      {isMobile ? <ChartMobile /> : <ChartDesktop />}
    </section>
  )
}

export default memo(MonthlyIncome)
