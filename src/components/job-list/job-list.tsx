import React, { FC } from 'react';
import { JobItem } from '../job-item/job-item';
import { Job } from '../../mocks';

interface JobListProps {
  jobs: Array<Job>;
}

export const JobList: FC<JobListProps> = ({ jobs }) => {
  return (
    <ul>
      {jobs.map((job) => (
        <JobItem key={job.id} data={job} />
      ))}
    </ul>
  );
};
