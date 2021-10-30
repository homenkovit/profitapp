import React, { FC, useEffect, useMemo, useState } from 'react';
import { useOrder } from '../../contexts/order-context';
import { Chart, ChartItem } from '../chart/chart';
import { ReactComponent as IconInfo } from '../../assets/images/info.svg';
import { ReactComponent as IconPriceTab } from '../../assets/images/price-tab.svg';
import { ReactComponent as IconChartTab } from '../../assets/images/chart-tab.svg';
import styles from './statistics.module.scss';
import { MONTHS } from '../../utils';

const getInitialPlansAndFact = () => MONTHS.map(() => ({ plan: 0, fact: 0 }));

export const Statistics: FC = () => {
  const { orders, currentYearCompletedOrders } = useOrder();
  const [plansAndFacts, setPlansAndFacts] = useState<ChartItem[]>(getInitialPlansAndFact());
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const currentMonthIndex = useMemo(() => new Date().getMonth(), []);
  const currentPlanAndFact = plansAndFacts[currentMonthIndex];

  useEffect(() => {
    const newPlansAndFacts = getInitialPlansAndFact();

    [...orders, ...currentYearCompletedOrders]
      .forEach((order) => {
        if (order.isPermanent) {
          const orderCreatedYear = order.createdAt.toDate().getFullYear();
          const orderCreatedMonthIndex = order.createdAt.toDate().getMonth();
          for (let monthIndex = 0; monthIndex < newPlansAndFacts.length; monthIndex++) {
            const item = newPlansAndFacts[monthIndex];
            if (order.isCompleted && order.completedYear && order.completedMonth !== undefined) {
              const orderCompletedMonthIndex = order.completedMonth;
              if ((orderCreatedYear === order.completedYear
                    && monthIndex >= orderCreatedMonthIndex
                    && monthIndex <= orderCompletedMonthIndex)
                  || (orderCreatedYear < order.completedYear && monthIndex <= orderCompletedMonthIndex)
              ) {
                item.plan += order.price;
                item.fact += order.price;
              }
            } else if (orderCreatedYear < currentYear || (orderCreatedYear === currentYear && monthIndex >= orderCreatedMonthIndex)) {
              item.plan += order.price;
              if (monthIndex < currentMonthIndex) {
                item.fact += order.price;
              }
            }
          }
        } else if (order.year === currentYear && order.month !== undefined) {
          const orderMonthIndex = order.month;
          newPlansAndFacts[orderMonthIndex].plan += order.price;
          if (order.isCompleted) {
            newPlansAndFacts[orderMonthIndex].fact += order.price;
          }
        }
      });

    setPlansAndFacts(newPlansAndFacts);
  }, [orders, currentYearCompletedOrders]);

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
