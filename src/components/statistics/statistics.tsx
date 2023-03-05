import React, { FC, useCallback, ChangeEvent, useState } from 'react';
import { ReactComponent as IconPriceTab } from '../../assets/images/price-tab.svg';
import { ReactComponent as IconChartTab } from '../../assets/images/chart-tab.svg';
import { useChartData } from './useChartData';
import styles from './statistics.module.scss';
import { useIsMobile } from '../../hooks/useIsMobile';
import { CurrentIncome } from './components/current-income/current-income';
import { MonthlyIncome } from './components/monthly-income/monthly-income';

enum StatisticsTabs {
  CURRENT_INCOME = 'current-income',
  MONTHLY_INCOME = 'monthly-income',
}

export const Statistics: FC = () => {
  const [currentTab, setCurrentTab] = useState<StatisticsTabs>(StatisticsTabs.CURRENT_INCOME);
  const { plansAndFacts, currentPlanAndFact } = useChartData();
  const isMobile = useIsMobile();

  const onTabChange = useCallback((event: ChangeEvent<HTMLDivElement>) => {
    const nextTab = (event.target as HTMLInputElement).value as StatisticsTabs;
    setCurrentTab(nextTab);
  }, []);

  const getMobileStatisticsContent = useCallback(() => {
    switch (currentTab) {
      case StatisticsTabs.CURRENT_INCOME:
      default:
        return <CurrentIncome data={currentPlanAndFact} />;
      case StatisticsTabs.MONTHLY_INCOME:
        return <MonthlyIncome data={plansAndFacts} />;
    }
  }, [currentTab]);

  return (
    <div className={`${styles.statistics} ${styles['first-tab-selected']}`}>
      <div className={styles.tabs} onChange={onTabChange}>
        <label htmlFor="current-income" className={currentTab === StatisticsTabs.CURRENT_INCOME ? styles.active : ''}>
          <IconPriceTab />
          <input type="radio" id="current-income" className="visually-hidden" name="tab-type" value={StatisticsTabs.CURRENT_INCOME} defaultChecked />
        </label>
        <label htmlFor="monthly-income" className={currentTab === StatisticsTabs.MONTHLY_INCOME ? styles.active : ''}>
          <IconChartTab />
          <input type="radio" id="monthly-income" className="visually-hidden" name="tab-type" value={StatisticsTabs.MONTHLY_INCOME} />
        </label>
      </div>
      { isMobile
        ? getMobileStatisticsContent()
        : (
          <>
            <CurrentIncome data={currentPlanAndFact} />
            <MonthlyIncome data={plansAndFacts} />
          </>
        )
      }
    </div>
  );
};
