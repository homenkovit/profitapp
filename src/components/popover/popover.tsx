import { FC, ReactElement, useRef, ReactNode, memo } from 'react'
import Tippy, { TippyProps } from '@tippyjs/react/headless'
// eslint-disable-next-line import/no-extraneous-dependencies
import { Instance } from 'tippy.js'

import styles from './popover.module.scss'

interface PopoverProperties {
  visible?: boolean
  className?: string
  placement?: TippyProps['placement']
  role?: string
  children?: ReactElement
  content?: ReactNode
  onMount?: (instance: Instance) => void
}

const Popover: FC<PopoverProperties> = ({
  visible,
  className,
  placement = 'bottom',
  role,
  children,
  content,
  onMount,
}) => {
  const popoverReference = useRef<Instance>()
  const popoverContentReference = useRef<HTMLDivElement>(null)

  let trigger: string | undefined
  if (visible === undefined) {
    trigger = 'click'
  }

  const onPopoverRootKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Escape' && popoverReference.current) {
      popoverReference.current.hide()
    }
  }

  const onPopoverMount = (instance: Instance): void => {
    popoverReference.current = instance
    if (popoverContentReference.current) {
      popoverContentReference.current.focus()
    }
    if (onMount) {
      onMount(instance)
    }
  }

  return (
    <Tippy
      visible={visible}
      placement={placement}
      interactive
      trigger={trigger}
      appendTo={(): HTMLElement => document.body}
      onMount={onPopoverMount}
      render={(attributes): ReactElement => {
        if (visible !== false) {
          return (
            // eslint-disable-next-line jsx-a11y/no-static-element-interactions
            <div
              role={role || 'dialog'}
              className={`${styles.popover} ${className ?? ''}`}
              onKeyDown={onPopoverRootKeyDown}
              // eslint-disable-next-line react/jsx-props-no-spreading
              {...attributes}
            >
              <div ref={popoverContentReference} tabIndex={-1} className={styles.content}>
                {content}
              </div>
              <div data-popper-arrow="" className={styles.arrow} />
            </div>
          )
        }
        return <div />
      }}
    >
      {children}
    </Tippy>
  )
}

export default memo(Popover)
