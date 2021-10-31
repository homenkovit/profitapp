import React, { FC, useMemo, useState } from 'react';
import { LOCAL_STORAGE_SORT_KEY, SortType, sortTypeToText, useOrder } from '../../contexts/order-context';
import styles from './sort-bar.module.scss';

export const SortBar: FC = () => {
  const { sortOrders } = useOrder();

  return (
    <>
      <span className={styles.text}>сортировать по: </span>
      <ul className={styles.list}>
        {Object.values(SortType).map((sortType) => (
          <li key={sortType}>
            <button
              type='button'
              onClick={() => sortOrders(sortType)}
              className={localStorage.getItem(LOCAL_STORAGE_SORT_KEY) === sortType ? styles.active : ''}
            >
              {sortTypeToText(sortType)}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
};
