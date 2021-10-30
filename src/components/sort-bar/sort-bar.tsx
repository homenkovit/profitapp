import React, { FC, useMemo, useState } from 'react';
import styles from './sort-bar.module.scss';

export enum SortType {
  ASC_PRICE = 'asc',
  DESC_PRICE = 'desc',
  PERMANENT = 'permanent',
  ONCE = 'once',
  DATE = 'date',
}

export const LOCAL_STORAGE_SORT_KEY = 'sortType';

interface SortBarProps {
  onSortChange: (type: SortType) => void;
}

interface SortButton {
  text: string,
  sortType: SortType,
}

const actionButtons: SortButton[] = [
  { text: 'дате', sortType: SortType.DATE },
  { text: 'цене ↓', sortType: SortType.DESC_PRICE },
  { text: 'цене ↑', sortType:  SortType.ASC_PRICE },
  { text: 'разовые', sortType: SortType.ONCE },
  { text: 'постоянные', sortType: SortType.PERMANENT },
];

export const SortBar: FC<SortBarProps> = (props) => {
  const initActiveButtonIndex = useMemo(() => actionButtons.findIndex((button) => {
    return button.sortType === localStorage.getItem(LOCAL_STORAGE_SORT_KEY);
  }), [localStorage.getItem(LOCAL_STORAGE_SORT_KEY)]);

  const [activeButtonIndex, setActiveButtonIndex] = useState<number>(initActiveButtonIndex !== -1 ? initActiveButtonIndex : 0);

  const onClickHandler = (button: SortButton, index: number): void => {
    localStorage.setItem(LOCAL_STORAGE_SORT_KEY, button.sortType);
    props.onSortChange(button.sortType);
    setActiveButtonIndex(index);
  }

  return (
    <>
      <span className={styles.text}>сортировать по: </span>
      <ul className={styles.list}>
        {actionButtons.map((button, index) => {
          return (
            <button
              type='button'
              key={button.text}
              onClick={() => onClickHandler(button, index)}
              className={activeButtonIndex === index ? styles.active : ''}
            >
              {button.text}
            </button>
          )
        })}
      </ul>
    </>
  );
};
