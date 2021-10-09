import React, { FC } from 'react';
import { ReactComponent as IconLogo } from '../../assets/images/logo.svg';
import { ReactComponent as IconInfo } from '../../assets/images/info.svg';
import { ReactComponent as IconFooter } from '../../assets/images/footer.svg';
import { chartData, User } from '../../mocks';
import { Chart } from '../chart/chart';
import styles from './header.module.scss';

interface HeaderProps {
  user: User;
  createNewJob: () => void;
}

export const Header: FC<HeaderProps> = ({ user, createNewJob }) => {
  const totalPermanentPrice = user.jobs.reduce((counter, job) => {
    if (job.isPermanent) {
      counter += job.price;
    }
    return counter;
  }, 0);
  const totalSinglePrice = user.jobs.reduce((counter, job) => {
    if (!job.isPermanent) {
      counter += job.price;
    }
    return counter;
  }, 0);
  const totalPrice = totalPermanentPrice + totalSinglePrice;
  return (
    <header className={styles.header}>
      <h1 className='visually-hidden'>ProfitApp</h1>
      <IconLogo className={styles.logo} aria-label='Profit App logo' />
      <p className={styles.greeting}>
        Привет, <span>{user.name}</span>. Хорошего тебе дня!
      </p>
      <button type='button' className={styles['add-new-job-button']} onClick={createNewJob}>
        Новый заказ
      </button>
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
            доход в текущем месяце <IconInfo className={styles['info-icon']} />
          </p>
          <p className={styles['total-price']}>
            {totalPrice} <span className={styles.currency}>₽</span>
          </p>
          <div className={styles.totals}>
            <p className={styles['totals-where-text']}>из них</p>
            <span className={`${styles['totals-text']} ${styles.permanent}`}>
              {totalPermanentPrice} <span className={styles.currency}>₽</span>
              <span className={styles['totals-hint-text']}>разово</span>
            </span>
            <span className={`${styles['totals-text']} ${styles.single}`}>
              {totalSinglePrice} <span className={styles.currency}>₽</span>
              <span className={styles['totals-hint-text']}>постоянно</span>
            </span>
          </div>
        </section>
        <section id='chart-section' className={styles['chart-section']}>
          <Chart data={chartData} />
        </section>
      </div>
      <IconFooter aria-hidden className={styles['mobile-footer-icon']} />
    </header>
  );
};
