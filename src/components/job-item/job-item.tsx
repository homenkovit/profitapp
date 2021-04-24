import React, { FC, useState } from 'react';
import { Job } from '../../mocks';
import { JobItemForm } from './job-item-form';

interface JobItemProps {
  data: Job;
}

export const JobItem: FC<JobItemProps> = ({ data }) => {
  const [isForm, setIsForm] = useState(!data.description.length);
  if (isForm) {
    return <JobItemForm data={data} />;
  }
  return (
    <div>
      <p>{data.description}</p>
      <strong>{data.price}</strong>
      {data.isPermanent ? <div>permanent icon</div> : <mark>{data.month}</mark>}
      <ul>
        <li>
          <button type='button'>complete</button>
        </li>
        <li>
          <button type='button' onClick={() => setIsForm(true)}>
            edit
          </button>
        </li>
        <li>
          <button type='button'>delete</button>
        </li>
      </ul>
    </div>
  );
};
