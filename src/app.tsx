import React from 'react';
import { Header } from './components/header/header';
import { JobList } from './components/job-list/job-list';
import { SortBar } from './components/sort-bar/sort-bar';
import { ReactComponent as IconSettings } from './assets/images/settings.svg';
import { ReactComponent as IconLogout } from './assets/images/logout.svg';
import styles from './app.module.css';
import './base.css';
import './resources/styles/modules.scss';
import { user } from './mocks';

const App = () => {
  return (
    <div className={styles.app}>
      <Header user={user} />
      <main>
        <div className={styles['top-bar']}>
          <SortBar />
          <button type='button' aria-label='settings' className={styles['settings-button']}>
            <IconSettings aria-hidden />
          </button>
          <a href='#' aria-label='logout' className={styles.logout}>
            <IconLogout aria-hidden />
          </a>
        </div>
        <JobList jobs={user.jobs} />
      </main>
    </div>
  );
};

export default App;
