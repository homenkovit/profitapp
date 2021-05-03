import React from 'react';
import styles from './sort-bar.module.css';

export const SortBar = () => {
  return (
    <>
      <span className={styles.text}>сортировать по: </span>
      <ul className={styles.list}>
        <li>
          <button type='button' className={styles.active}>
            цене проекта
          </button>
        </li>
        <li>
          <button type='button'>постоянным</button>
        </li>
        <li>
          <button type='button'>разовым</button>
        </li>
        <li>
          <button type='button'>порядку</button>
        </li>
      </ul>
    </>
  );
};
