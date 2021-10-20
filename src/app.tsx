import React from 'react';
import { Header } from './components/header/header';
import { JobList } from './components/job-list/job-list';
import { SortBar } from './components/sort-bar/sort-bar';
import styles from './app.module.scss';
import './base.css';
import './resources/styles/modules.scss';
import { user } from './mocks';
import { GreetingMessage } from './components/greeting-message/greeting-message';
import { TopBarRightActions } from './components/top-bar-right-actions/top-bar-right-actions';

const App = () => (
  <div className={styles.app}>
    <Header user={user} />
    <main>
      <div className={styles['top-bar']}>
        <SortBar />
        <TopBarRightActions />
      </div>
      { /* TODO: add visibility by auth and onLogIn / onRegister methods */ }
      <GreetingMessage
        isVisible
        onLogIn={() => {}}
        onRegister={() => {}}
      />
      <JobList jobs={user.jobs} />
    </main>
  </div>
);

export default App;
