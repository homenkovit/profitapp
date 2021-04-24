import React from 'react';
import { Header } from './components/header/header';
import { JobList } from './components/job-list/job-list';
import { SortBar } from './components/sort-bar/sort-bar';
import { user } from './mocks';

export const App = () => {
  return (
    <div>
      <Header user={user} />
      <main>
        <div>
          <SortBar />
          <button type='button'>settings</button>
          <a href='#'>logout</a>
        </div>
        <JobList jobs={user.jobs} />
      </main>
    </div>
  );
};
