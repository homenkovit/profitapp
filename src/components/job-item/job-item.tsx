import React, { FC, useState } from 'react';
import { Job } from '../../mocks';
import { JobItemForm } from './job-item-form';
import { ReactComponent as IconPermanent } from '../../assets/images/permanent.svg';
import { ReactComponent as IconComplete } from '../../assets/images/complete-small.svg';
import { ReactComponent as IconEdit } from '../../assets/images/edit-small.svg';
import { ReactComponent as IconDelete } from '../../assets/images/delete-small.svg';
import styles from './job-item.module.scss';

interface JobItemProps {
  data: Job;
}

export const JobItem: FC<JobItemProps> = ({ data }) => {
  const [isForm, setIsForm] = useState(!data.description.length);
  if (isForm) {
    return <JobItemForm data={data} />;
  }
  return (
    <div className={`${styles.card} ${data.isPermanent ? styles.permanent : styles.single}`}>
      <p className={styles.description}>{data.description}</p>
      <strong className={styles.price}>{data.price} ₽</strong>
      {data.isPermanent ? <IconPermanent aria-label='permanent' className={styles['permanent-icon']} /> : <mark className={styles.month}>{data.month}</mark>}
      <ul className={styles.actions}>
        <li>
          <button type='button' aria-label='complete'>
            <IconComplete aria-hidden />
          </button>
        </li>
        <li>
          <button type='button' onClick={() => setIsForm(true)} aria-label='edit'>
            <IconEdit aria-hidden />
          </button>
        </li>
        <li>
          <button type='button' aria-label='delete'>
            <IconDelete aria-hidden />
          </button>
        </li>
      </ul>
    </div>
  );
};
