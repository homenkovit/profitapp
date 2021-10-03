import React, { useState } from 'react';
import { Header } from './components/header/header';
import { JobList } from './components/job-list/job-list';
import { SortBar } from './components/sort-bar/sort-bar';
import { Alert, AlertType } from './components/alert/alert';
import { ReactComponent as IconSettings } from './assets/images/settings.svg';
import { ReactComponent as IconLogout } from './assets/images/logout.svg';
import styles from './app.module.scss';
import './base.css';
import { user } from './mocks';
import { WELCOME_MESSAGE } from './utils';

const App = () => {
  // TODO: rewrite alert visibility with state on server (show once on start). For discussing.
  const [isAlertVisible, setAlertVisible] = useState(true);

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
        <Alert
          isVisible={isAlertVisible}
          type={AlertType.INFO}
          onClose={() => setAlertVisible(false)}
        >
          {WELCOME_MESSAGE}
        </Alert>
        <JobList jobs={user.jobs} />
      </main>
    </div>
  );
};

export default App;
