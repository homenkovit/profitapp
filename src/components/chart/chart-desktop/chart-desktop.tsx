import { FC, memo } from 'react'
import Tippy from '@tippyjs/react'

// eslint-disable-next-line import/no-extraneous-dependencies
import 'tippy.js/dist/tippy.css'

import { MONTHS } from 'global/constants'

import { ChartItem } from '../types'

import styles from './chart-desktop.module.scss'

interface ChartDesktopProperties {
  plansAndFacts: ChartItem[]
  definePlanColumnHeight: (planValue: number) => string
}

const ChartDesktop: FC<ChartDesktopProperties> = ({ plansAndFacts, definePlanColumnHeight }) => {
  const tooltipContent = (plan: number, fact: number, index: number): JSX.Element => (
    <>
      <span className={styles.month}>{MONTHS[index]}</span>
      <div>
        <span className={styles.label}>План: </span>
        {plan.toLocaleString('ru-RU', {
          style: 'currency',
          currency: 'RUB',
          maximumFractionDigits: 0,
        })}
      </div>
      <div>
        <span className={styles.label}>Факт: </span>
        {fact.toLocaleString('ru-RU', {
          style: 'currency',
          currency: 'RUB',
          maximumFractionDigits: 0,
        })}
      </div>
    </>
  )

  return (
    <div className={styles.chart}>
      <ul className={styles['chart-list']}>
        {plansAndFacts.map((month, index) => (
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
