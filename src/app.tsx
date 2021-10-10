import React, { useState } from 'react';
import { Header } from './components/header/header';
import { JobList } from './components/job-list/job-list';
import { SortBar } from './components/sort-bar/sort-bar';
import { ReactComponent as IconSettings } from './assets/images/settings.svg';
import { ReactComponent as IconLogout } from './assets/images/logout.svg';
import styles from './app.module.scss';
import './base.css';
import { Job, user } from './mocks';
import { JobItemForm } from './components/job-item/job-item-form';

const App = () => {
  const [isNewJobFormVisible, setNewJobFormVisible] = useState(false);

  const newJobStub: Job = {
    id: Math.random().toString(),
    description: '',
    isPermanent: false,
    price: 0,
  };

  const createNewJob = () => {
    if (!isNewJobFormVisible) {
      setNewJobFormVisible(true);
    }
  };

  return (
    <div className={styles.app}>
      <Header user={user} createNewJob={createNewJob} />
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
        {isNewJobFormVisible && <JobItemForm data={newJobStub} onClose={() => setNewJobFormVisible(false)} />}
        <JobList />
      </main>
    </div>
  );
};

export default App;
