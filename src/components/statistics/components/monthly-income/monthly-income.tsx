import React, { FC } from 'react';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import { ChartDesktop } from '../../../chart/chart-desktop/chart-desktop';
import { ChartMobile } from '../../../chart/chart-mobile/chart-mobile';
import { ChartItem } from '../../../chart/types';
import styles from './monthly-income.module.scss';

interface MonthlyIncomeProps {
  data: ChartItem[];
}

export const MonthlyIncome: FC<MonthlyIncomeProps> = ({ data }) => {
  const isMobile = useIsMobile();

  return (
    <section id='chart-section' className={styles['chart-section']}>
      {isMobile ? <ChartMobile data={data} /> : <ChartDesktop data={data} />}
    </section>
  );
};