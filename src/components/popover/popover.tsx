import React, { FC, ReactElement, useRef, ReactNode } from 'react';
import { Placement } from '@popperjs/core';
import Tippy from '@tippyjs/react/headless';
import { Instance } from 'tippy.js';
import styles from './popover.module.scss';

export interface PopoverProps {
  visible?: boolean;
  className?: string;
  placement?: Placement;
  role?: string;
  children?: ReactElement;
  content?: ReactNode;
  onMount?: (instance: Instance) => void;
}

export const Popover: FC<PopoverProps> = (props) => {
  const popoverRef = useRef<Instance>(null);
  const popoverContentRef = useRef<HTMLDivElement>(null);

  let trigger: string | undefined;
  if (props.visible === undefined) {
    trigger = 'click';
  }

  const onPopoverRootKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Escape') {
      if (popoverRef.current) {
        popoverRef.current.hide();
      }
    }
  };

  const onPopoverMount = (instance: Instance): void => {
    // @ts-ignore
    popoverRef.current = instance;
    if (popoverContentRef.current) {
      popoverContentRef.current.focus();
    }
    if (props.onMount) {
      props.onMount(instance);
    }
  };

  return (
    <Tippy
      visible={props.visible}
      placement={props.placement}
      interactive
      trigger={trigger}
      appendTo={(): HTMLElement => document.body}
      onMount={onPopoverMount}
      render={(attrs): ReactElement => {
        if (props.visible !== false) {
          return (
            <div
              role={props.role || 'dialog'}
              className={`${styles.popover} ${props.className ?? ''}`}
              onKeyDown={onPopoverRootKeyDown}
              {...attrs}
            >
              <div
                ref={popoverContentRef}
                tabIndex={-1}
                className={styles.content}
              >
                { props.content }
              </div>
              <div data-popper-arrow="" className={styles.arrow}></div>
            </div>
          )
        } return <div />;
      }}
    >
      { props.children }
    </Tippy>
  )
};

Popover.defaultProps = {
  placement: "bottom",
}
