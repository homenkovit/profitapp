import React, { useState } from 'react';
import { Header } from './components/header/header';
import { JobList } from './components/job-list/job-list';
import { SortBar } from './components/sort-bar/sort-bar';
import { ReactComponent as IconSettings } from './assets/images/settings.svg';
import { ReactComponent as IconLogout } from './assets/images/logout.svg';
import styles from './app.module.scss';
import './base.css';
import './resources/styles/modules.scss';
import { user } from './mocks';
import { GreetingMessage } from './components/greeting-message/greeting-message';
import { TopMenu } from './components/popover/top-menu/top-menu';

const App = () => (
  <div className={styles.app}>
    <Header user={user} />
    <main>
      <div className={styles['top-bar']}>
        <SortBar />
        { /* TODO: add onHistoryClick / onDarkModeClick methods */ }
        <TopMenu
          className={styles['top-menu']}
          onHistoryClick={() => {}}
          onDarkModeClick={() => {}}
        />
        <a href='#' aria-label='logout' className={styles.logout}>
          <IconLogout aria-hidden />
        </a>
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
