import { FC, useEffect, useState } from 'react'

import { MONTHS } from '../../../utils'
import { useChartData } from '../../statistics/use-chart-data'
import { ChartItem } from '../types'

import styles from './chart-mobile.module.scss'

interface MonthInfo {
  index: number
  name: string
  planFact: ChartItem
}

const ChartMobile: FC = () => {
  const { plansAndFacts, currentMonthIndex, definePlanColumnHeight } = useChartData()

  const [monthInfo, setMonthInfo] = useState<MonthInfo>({
    index: currentMonthIndex,
    name: MONTHS[currentMonthIndex],
    planFact: plansAndFacts[currentMonthIndex],
  })

  useEffect(() => {
    setMonthInfo({
      index: currentMonthIndex,
      name: MONTHS[currentMonthIndex],
      planFact: plansAndFacts[currentMonthIndex],
    })
  }, [currentMonthIndex, plansAndFacts])

  const onClick = (index: number): void => {
    setMonthInfo({
      index,
      name: MONTHS[index],
      planFact: plansAndFacts[index],
    })
  }

  return (
    <>
      <div className={styles['total-info']}>
        <div className={styles.fact}>
          <span className={styles['fact-value']}>{monthInfo.planFact.fact.toLocaleString()} ₽</span>
          <div className={styles.line} />
        </div>
        <div className={styles.month}>{monthInfo.name}</div>
        <div className={styles.plan}>
          <div className={styles.line} />
          <span className={styles['plan-value']}>{monthInfo.planFact.plan.toLocaleString()} ₽</span>
        </div>
      </div>
      <div className={styles.chart}>
        <ul className={styles['chart-list']}>
          {plansAndFacts.map((month, index) => (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
            <li
              className={styles['chart-list-item']}
              key={MONTHS[index]}
              onClick={(): void => {
                onClick(index)
              }}
            >
              <div
                className={`
                    ${styles['column-plan']}
                    ${monthInfo.index === index ? styles.active : ''}
                  `}
                style={{ height: definePlanColumnHeight(month.plan, 5) }}
              >
                <div className={styles['column-fact']} style={{ height: `${(month.fact * 100) / month.plan}%` }} />
              </div>
              <span
                className={`
                  ${styles['month-number']} 
                  ${monthInfo.index === index ? styles.active : ''}
                `}
              >
                {index + 1}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default ChartMobile
