import React, { FC, useEffect, useMemo, useState } from 'react';
import { useOrder } from '../../contexts/order-context';
import { Chart, ChartItem } from '../chart/chart';
import { ReactComponent as IconInfo } from '../../assets/images/info.svg';
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
            if (order.isCompleted && order.completedYear && order.completedMonth) {
              const orderCompletedMonthIndex = MONTHS.findIndex((month) => month === order.completedMonth);
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
        } else if (order.year === currentYear) {
          const orderMonthIndex = MONTHS.findIndex((month) => month === order.month);
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
            <svg width='13' height='13' viewBox='0 0 13 13' xmlns='http://www.w3.org/2000/svg'>
              <path d='M7.66406 11.2949H4.86914V13H2.23242V11.2949H0.448242V9.15918H2.23242V8.49121H0.448242V6.35547H2.23242V0.203125H7.20703C8.16797 0.203125 9.01172 0.375977 9.73828 0.72168C10.4648 1.06738 11.0273 1.5625 11.4258 2.20703C11.8301 2.8457 12.0322 3.5752 12.0322 4.39551C12.0322 5.66113 11.6016 6.66016 10.7402 7.39258C9.88477 8.125 8.69238 8.49121 7.16309 8.49121H4.86914V9.15918H7.66406V11.2949ZM4.86914 6.35547H7.14551C8.62207 6.35547 9.36035 5.70801 9.36035 4.41309C9.36035 3.79785 9.17285 3.30273 8.79785 2.92773C8.42285 2.54688 7.9043 2.35352 7.24219 2.34766H4.86914V6.35547Z' />
            </svg>
          </a>
        </li>
        <li>
          <a href='#chart-section'>
            <svg width='18' height='13' viewBox='0 0 18 13' xmlns='http://www.w3.org/2000/svg'>
              <rect y='2' width='3' height='11' rx='1.5' />
              <rect x='5' width='3' height='13' rx='1.5' />
              <rect x='10' y='2' width='3' height='11' rx='1.5' />
              <rect x='15' width='3' height='13' rx='1.5' />
            </svg>
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
