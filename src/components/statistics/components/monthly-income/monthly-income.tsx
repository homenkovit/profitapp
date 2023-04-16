import { FC, memo } from 'react'

import { ChartMobile } from 'components/chart/chart-mobile'
import { ChartItem } from 'components/chart/types'

import { useIsMobile } from '../../../../hooks/use-is-mobile'
import { ChartDesktop } from '../../../chart/chart-desktop'

import styles from './monthly-income.module.scss'

interface MonthlyIncomeProperties {
  plansAndFacts: ChartItem[]
  currentMonthIndex: number
  definePlanColumnHeight: (planValue: number) => string
}

const MonthlyIncome: FC<MonthlyIncomeProperties> = ({ plansAndFacts, currentMonthIndex, definePlanColumnHeight }) => {
  const isMobile = useIsMobile()

  return (
    <section id="chart-section" className={styles['chart-section']}>
      {isMobile ? (
        <ChartMobile
          plansAndFacts={plansAndFacts}
          currentMonthIndex={currentMonthIndex}
          definePlanColumnHeight={definePlanColumnHeight}
        />
      ) : (
        <ChartDesktop plansAndFacts={plansAndFacts} definePlanColumnHeight={definePlanColumnHeight} />
      )}
    </section>
  )
}

export default memo(MonthlyIncome)
