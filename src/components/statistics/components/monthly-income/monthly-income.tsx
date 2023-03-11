import { FC, memo } from 'react'

import { useIsMobile } from '../../../../hooks/use-is-mobile'
import { ChartDesktop } from '../../../chart/chart-desktop'
import { ChartMobile } from '../../../chart/chart-mobile/chart-mobile'
import { ChartItem } from '../../../chart/types'

import styles from './monthly-income.module.scss'

interface MonthlyIncomeProperties {
  data: ChartItem[]
}

const MonthlyIncome: FC<MonthlyIncomeProperties> = ({ data }) => {
  const isMobile = useIsMobile()

  return (
    <section id="chart-section" className={styles['chart-section']}>
      {isMobile ? <ChartMobile data={data} /> : <ChartDesktop data={data} />}
    </section>
  )
}

export default memo(MonthlyIncome)
