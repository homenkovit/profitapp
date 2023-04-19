import { FC, useCallback, ChangeEvent, useState, memo } from 'react'

import { ReactComponent as IconPriceTab } from '../../assets/images/price-tab.svg'
import { ReactComponent as IconChartTab } from '../../assets/images/chart-tab.svg'
import { useIsMobile } from '../../hooks/use-is-mobile'

import { useChartData } from './use-chart-data'
import styles from './statistics.module.scss'
import { CurrentIncome } from './components/current-income'
import { MonthlyIncome } from './components/monthly-income'

enum StatisticsTabs {
  CURRENT_INCOME = 'current-income',
  MONTHLY_INCOME = 'monthly-income',
}

const Statistics: FC = () => {
  const [currentTab, setCurrentTab] = useState<StatisticsTabs>(StatisticsTabs.CURRENT_INCOME)
  const { plansAndFacts, currentPlanAndFact, currentMonthIndex, definePlanColumnHeight } = useChartData()
  const isMobile = useIsMobile()

  const onTabChange = useCallback((event: ChangeEvent<HTMLDivElement>) => {
    const nextTab = (event.target as HTMLInputElement).value as StatisticsTabs
    setCurrentTab(nextTab)
  }, [])

  const getMobileStatisticsContent = (): JSX.Element => {
    switch (currentTab) {
      case StatisticsTabs.CURRENT_INCOME: {
        return <CurrentIncome data={currentPlanAndFact} />
      }
      case StatisticsTabs.MONTHLY_INCOME: {
        return (
          <MonthlyIncome
            plansAndFacts={plansAndFacts}
            currentMonthIndex={currentMonthIndex}
            definePlanColumnHeight={definePlanColumnHeight}
          />
        )
      }
      default: {
        return <CurrentIncome data={currentPlanAndFact} />
      }
    }
  }

  return (
    <div
      className={`${styles.statistics} ${
        currentTab === StatisticsTabs.CURRENT_INCOME ? styles['first-tab-selected'] : ''
      }`}
    >
      <div className={styles.tabs} onChange={onTabChange}>
        <label htmlFor="current-income" className={currentTab === StatisticsTabs.CURRENT_INCOME ? styles.active : ''}>
          <IconPriceTab />
          <input
            type="radio"
            id="current-income"
            className="visually-hidden"
            name="tab-type"
            value={StatisticsTabs.CURRENT_INCOME}
            defaultChecked
          />
        </label>
        <label htmlFor="monthly-income" className={currentTab === StatisticsTabs.MONTHLY_INCOME ? styles.active : ''}>
          <IconChartTab />
          <input
            type="radio"
            id="monthly-income"
            className="visually-hidden"
            name="tab-type"
            value={StatisticsTabs.MONTHLY_INCOME}
          />
        </label>
      </div>
      {isMobile ? (
        getMobileStatisticsContent()
      ) : (
        <>
          <CurrentIncome data={currentPlanAndFact} />
          <MonthlyIncome
            plansAndFacts={plansAndFacts}
            currentMonthIndex={currentMonthIndex}
            definePlanColumnHeight={definePlanColumnHeight}
          />
        </>
      )}
    </div>
  )
}

export default memo(Statistics)
