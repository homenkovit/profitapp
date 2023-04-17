import { FC, memo, useCallback, useMemo } from 'react'
import Tippy from '@tippyjs/react'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'tippy.js/dist/tippy.css'

import { MONTHS } from 'global/constants'

import { ChartItem } from '../types'

import styles from './chart-desktop.module.scss'

interface ChartDesktopProperties {
  data: ChartItem[]
}

const ChartDesktop: FC<ChartDesktopProperties> = ({ data }) => {
  const planArray: number[] = useMemo(() => {
    return data.map((item: ChartItem) => item.plan)
  }, [data])

  const maxPlan: number = useMemo(() => {
    return Math.max.apply(null, planArray)
  }, [planArray])

  const tooltipContent = (plan: number, fact: number, index: number): JSX.Element => (
    <>
      <span className={styles.month}>{MONTHS[index]}</span>
      <div>
        <span className={styles.label}>План:</span> {plan.toLocaleString()} ₽
      </div>
      <div>
        <span className={styles.label}>Факт:</span> {fact.toLocaleString()} ₽
      </div>
    </>
  )

  const definePlanColumnHeight = useCallback(
    (planValue: number): string => {
      return planValue === 0 ? '3%' : `${(planValue * 100) / maxPlan}%`
    },
    [maxPlan],
  )

  return (
    <div className={styles.chart}>
      <ul className={styles['chart-list']}>
        {data.map((month, index) => (
          <Tippy
            content={tooltipContent(month.plan, month.fact, index)}
            className={styles.tooltip}
            // eslint-disable-next-line react/no-array-index-key
            key={`${month.fact}-${index}`}
          >
            <li className={styles['column-plan']} style={{ height: definePlanColumnHeight(month.plan) }}>
              <div className={styles['column-fact']} style={{ height: `${(month.fact * 100) / month.plan}%` }}>
                <div className="visually-hidden">{tooltipContent(month.plan, month.fact, index)}</div>
              </div>
            </li>
          </Tippy>
        ))}
      </ul>
    </div>
  )
}

export default memo(ChartDesktop)
