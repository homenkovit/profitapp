import React, { FC, useRef } from 'react';
import { Popover } from '../popover';
import { Instance } from 'tippy.js';
import { SettingsMenuContent } from './settings-menu-content/settings-menu-content';
import { ReactComponent as IconSettings } from '../../../assets/images/settings.svg';
import styles from './settings-menu.module.scss';

export interface SettingsMenuProps {
  className?: string;
  onHistoryClick: () => void;
  onDarkModeClick: () => void;
};

export const SettingsMenu: FC<SettingsMenuProps> = (props) => {
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
        <SettingsMenuContent
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
