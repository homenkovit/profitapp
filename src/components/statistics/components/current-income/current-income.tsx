import { FC, memo } from 'react'

import { ChartItem } from '../../../chart/types'
import { ReactComponent as IconInfo } from '../../../../assets/images/info.svg'

import styles from './current-income.module.scss'

interface CurrentIncomeProperties {
  data: ChartItem
}

const CurrentIncome: FC<CurrentIncomeProperties> = ({ data }) => {
  return (
    <section id="profit-section" className={styles['profit-section']}>
      <p className={styles['profit-in-month-text']}>
        <IconInfo className={styles['info-icon']} /> доход в текущем месяце
      </p>
      <p className={styles.plan}>
        {data.plan} <span className={styles.currency}>₽</span>
      </p>
      <p className={styles.fact}>
        {data.fact} <span className={styles.currency}>₽</span>
      </p>
    </section>
  )
}

export default memo(CurrentIncome)
