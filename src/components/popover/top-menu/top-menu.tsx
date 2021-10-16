import React, { FC, useRef } from 'react';
import { Popover } from '../popover';
import { Instance } from 'tippy.js';
import { TopMenuContent } from '../top-menu-content/top-menu-content';
import { ReactComponent as IconSettings } from '../../../assets/images/settings.svg';
import styles from './top-menu.module.scss';

export interface TopMenuProps {
  className?: string;
  onHistoryClick: () => void;
  onDarkModeClick: () => void;
};

export const TopMenu: FC<TopMenuProps> = (props) => {
  const popoverRef = useRef<Instance>();

  const onHistoryButtonClick = (): void => {
    props.onHistoryClick();
    popoverRef.current?.hide();
  };

  const onDarkModeButtonClick = (): void => {
    props.onDarkModeClick();
    popoverRef.current?.hide();
  };

  return (
    <Popover
      role="menu"
      onMount={(instance): void => {
        popoverRef.current = instance;
      }}
      content={
        <TopMenuContent
          onHistoryClick={onHistoryButtonClick}
          onDarkModeClick={onDarkModeButtonClick}
        />
      }
    >
      <button
        type="button"
        aria-label="open settings menu"
        aria-haspopup="true"
        className={`${styles['settings-button']} ${props.className ?? ''}`}
      >
        <IconSettings aria-hidden />
      </button>
  </Popover>
  );
};
