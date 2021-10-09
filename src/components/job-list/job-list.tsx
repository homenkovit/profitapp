import React, { FC, useEffect, useState } from 'react';
import { useAuth } from '../../contexts/auth-context';
import { Job } from '../../mocks';
import { JobItem } from '../job-item/job-item';
import { collection, getFirestore, onSnapshot, query, where } from 'firebase/firestore';
import styles from './job-list.module.scss';

export const JobList: FC = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    if (user) {
      const { uid } = user;
      const db = getFirestore();
      const jobsQueryByUserid = query(collection(db, 'jobs'), where('uid', '==', uid));

      return onSnapshot(jobsQueryByUserid, (querySnapshot) => {
        setJobs(querySnapshot.docs.map((doc: any) => {
          const { description, isPermanent, month, price } = doc.data();

          return {
            id: doc.id,
            description,
            isPermanent,
            month,
            price,
          };
        }));
      });
    }
  }, [user])

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
