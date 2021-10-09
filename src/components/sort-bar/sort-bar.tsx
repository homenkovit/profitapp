import React from 'react';
import styles from './sort-bar.module.scss';

export const SortBar = () => {
  return (
    <>
      <span className={styles.text}>сортировать по: </span>
      <ul className={styles.list}>
        <li>
          <button type='button' className={styles.active}>
            по дате
          </button>
        </li>
        <li>
          <button type='button'>по цене</button>
        </li>
        <li>
          <button type='button'>разовые</button>
        </li>
        <li>
          <button type='button'>постоянные</button>
        </li>
      </ul>
    </>
  );
};
