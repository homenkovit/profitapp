import React, { FC } from 'react';
import { ChartItem } from '../../../chart/types';
import { ReactComponent as IconInfo } from '../../../../assets/images/info.svg';
import styles from './current-income.module.scss';

interface CurrentIncomeProps {
  data: ChartItem,
}

export const CurrentIncome: FC<CurrentIncomeProps> = ({ data }) => {
  return (
    <section id='profit-section' className={styles['profit-section']}>
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
  );
};