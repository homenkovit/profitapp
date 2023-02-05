import React, { FC } from 'react';
import { Chart } from '../chart/chart';
import { ReactComponent as IconInfo } from '../../assets/images/info.svg';
import { ReactComponent as IconPriceTab } from '../../assets/images/price-tab.svg';
import { ReactComponent as IconChartTab } from '../../assets/images/chart-tab.svg';
import { useChartData } from './useChartData';
import styles from './statistics.module.scss';

export const Statistics: FC = () => {
  const { plansAndFacts, currentPlanAndFact } = useChartData();

  return (
    <div className={`${styles.statistics} ${styles['first-tab-selected']}`}>
      <ul className={styles.tabs}>
        <li className={styles.active}>
          <a href='#profit-section'>
            <IconPriceTab />
          </a>
        </li>
        <li>
          <a href='#chart-section'>
            <IconChartTab />
          </a>
        </li>
      </ul>
      <section id='profit-section' className={styles['profit-section']}>
        <p className={styles['profit-in-month-text']}>
          <IconInfo className={styles['info-icon']} /> доход в текущем месяце
        </p>
        <p className={styles.plan}>
          {currentPlanAndFact.plan} <span className={styles.currency}>₽</span>
        </p>
        <p className={styles.fact}>
          {currentPlanAndFact.fact} <span className={styles.currency}>₽</span>
        </p>
      </section>
      <section id='chart-section' className={styles['chart-section']}>
        <Chart data={plansAndFacts} />
      </section>
    </div>
  );
};
