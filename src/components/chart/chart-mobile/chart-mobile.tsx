/* eslint-disable max-lines */
import { FC, useEffect, useState, memo } from 'react'

import { MONTHS } from 'global/constants'

import { ChartItem } from '../types'

import styles from './chart-mobile.module.scss'

interface MonthInfo {
  index: number
  name: string
  planFact: ChartItem
}

interface ChartMobileProperties {
  plansAndFacts: ChartItem[]
  currentMonthIndex: number
  definePlanColumnHeight: (planValue: number) => string
}

const ChartMobile: FC<ChartMobileProperties> = ({ plansAndFacts, currentMonthIndex, definePlanColumnHeight }) => {
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

  const onChartColumnClick = (index: number): void => {
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
          <span className={styles['fact-value']}>
            {monthInfo.planFact.fact.toLocaleString('ru-RU', {
              style: 'currency',
              currency: 'RUB',
              maximumFractionDigits: 0,
            })}
          </span>
          <div className={styles.line} />
        </div>
        <div className={styles.month}>{monthInfo.name}</div>
        <div className={styles.plan}>
          <div className={styles.line} />
          <span className={styles['plan-value']}>
            {monthInfo.planFact.plan.toLocaleString('ru-RU', {
              style: 'currency',
              currency: 'RUB',
              maximumFractionDigits: 0,
            })}
          </span>
        </div>
      </div>
      <div className={styles.chart}>
        <ul className={styles['chart-list']}>
          {plansAndFacts.map((month, index) => (
            <li className={styles['chart-list-item']} key={MONTHS[index]}>
              <button
                type="button"
                className={styles['chart-list-item-button']}
                onClick={(): void => onChartColumnClick(index)}
              >
                <div
                  className={`${styles['column-plan']} ${monthInfo.index === index ? styles.active : ''}`}
                  style={{ height: definePlanColumnHeight(month.plan) }}
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
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default memo(ChartMobile)
