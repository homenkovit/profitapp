import React, { FC, useState } from 'react';
import { Popover } from '../popover';
import { TopMenuContent } from '../top-menu-content/top-menu-content';
import { ReactComponent as IconSettings } from '../../../assets/images/settings.svg';
import styles from './top-menu.module.scss';

export interface TopMenuProps {
  className?: string;
  onHistoryClick: () => void;
  onDarkModeClick: () => void;
};

export const TopMenu: FC<TopMenuProps> = (props) => {
  const [isPopoverHidden, setPopoverHidden] = useState(false);

  const onHistoryButtonClick = (): void => {
    props.onHistoryClick();
    setPopoverHidden(true);
  };

  const onDarkModeButtonClick = (): void => {
    props.onDarkModeClick();
    setPopoverHidden(true);
  };

  return (
    <Popover
      role="menu"
      hideOnElementClick={isPopoverHidden}
      onHide={() => setPopoverHidden(false)}
      content={
        <TopMenuContent
          onHistoryClick={onHistoryButtonClick}
          onDarkModeClick={onDarkModeButtonClick}
        />
      }
    >
      <button
        type='button'
        aria-label='settings'
        className={`${styles['settings-button']} ${props.className ?? ''}`}
      >
        <IconSettings aria-hidden />
      </button>
  </Popover>
  );
}