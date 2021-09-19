import React, { FC } from 'react';
import { JobItem } from '../job-item/job-item';
import { Job } from '../../mocks';
import styles from './job-list.module.scss';

interface JobListProps {
  jobs: Array<Job>;
}

export const JobList: FC<JobListProps> = ({ jobs }) => {
  return (
    <ul className={styles.list}>
      {jobs.map((job) => (
        <li key={job.id}>
          <JobItem data={job} />
        </li>
      ))}
    </ul>
  );
};
