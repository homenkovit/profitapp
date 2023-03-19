import React, { FC, useEffect, useState } from 'react';
import { MONTHS } from '../../../utils';
import { useChartData } from '../../statistics/useChartData';
import styles from './chart-mobile.module.scss';

const ChartMobile: FC = () => {
  const {
    plansAndFacts,
    currentMonthIndex,
    definePlanColumnHeight,
  } = useChartData();

  const [monthInfo, setMonthInfo] = useState({
    index: currentMonthIndex,
    name: MONTHS[currentMonthIndex],
    planFact: plansAndFacts[currentMonthIndex],
  });

  useEffect(() => {
    setMonthInfo({
      index: currentMonthIndex,
      name: MONTHS[currentMonthIndex],
      planFact: plansAndFacts[currentMonthIndex],
    });
  }, [plansAndFacts]);

  const onClick = (index: number): void => {
    setMonthInfo({
      index,
      name: MONTHS[index],
      planFact: plansAndFacts[index],
    });
  };

  return (
    <>
      <div className={styles['total-info']}>
        <div className={styles.fact}>
          <span className={styles['fact-value']}>
            {monthInfo.planFact.fact.toLocaleString()} ₽
          </span>
          <div className={styles.line} />
        </div>
        <div className={styles.month}>
          {monthInfo.name}
        </div>
        <div className={styles.plan}>
          <div className={styles.line} />
          <span className={styles['plan-value']}>
            {monthInfo.planFact.plan.toLocaleString()} ₽
          </span>
        </div>
      </div>
      <div className={styles.chart}>
        <ul className={styles['chart-list']}>
          {plansAndFacts.map((month, index) => (
              <li
                className={styles['chart-list-item']}
                key={MONTHS[index]}
                onClick={() => {
                  onClick(index);
                }}
              >
                <div
                  className={`
                    ${styles['column-plan']}
                    ${monthInfo.index === index ? styles.active : ''}
                  `}
                  style={{height: definePlanColumnHeight(month.plan, 5)}}
                >
                  <div
                    className={styles['column-fact']}
                    style={{height: `${month.fact*100/month.plan}%`}}
                  />
                </div>
                <span className={`
                  ${styles['month-number']} 
                  ${monthInfo.index === index ? styles.active : ''}
                `}>
                  {index + 1}
                </span>
              </li>
          ))}
        </ul>
		  </div>
    </>
  );
};

export default ChartMobile;
