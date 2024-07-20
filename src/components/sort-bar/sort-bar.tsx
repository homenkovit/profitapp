import { FC, memo, useEffect, useRef } from 'react'

import { SortOrdersName } from 'hooks/use-sorted-orders'

import { SortButton } from './components/sort-button'
import styles from './sort-bar.module.scss'

const SortBar: FC = () => {
  const toolbarReference = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const toolbar = toolbarReference.current

    if (toolbar) {
      const buttons = [...toolbar.querySelectorAll('button')]
      if (buttons.length === 0) {
        return
      }

      const lastButtonIndex = buttons.length - 1
      let activeButtonIndex = buttons.findIndex((button) => button.tabIndex === 0)

      toolbar.addEventListener('keydown', (event) => {
        const activeButton = buttons[activeButtonIndex]
        let nextActiveButtonIndex = activeButtonIndex

        if (event.key === 'ArrowRight') {
          nextActiveButtonIndex = activeButtonIndex === lastButtonIndex ? 0 : activeButtonIndex + 1
        }

        if (event.key === 'ArrowLeft') {
          nextActiveButtonIndex = activeButtonIndex === 0 ? lastButtonIndex : activeButtonIndex - 1
        }

        const nextActiveButton = buttons[nextActiveButtonIndex]
        activeButton.tabIndex = -1
        nextActiveButton.tabIndex = 0
        nextActiveButton.focus()
        activeButtonIndex = nextActiveButtonIndex
      })
    }
  }, [])

  return (
    <div ref={toolbarReference} role="toolbar" aria-labelledby="toolbar-description" aria-controls="order-list">
      <span id="toolbar-description" className={styles.text}>
        сортировать по:{' '}
      </span>
      <div role="radiogroup" className={styles.list}>
        {Object.values(SortOrdersName).map((sortOrdersName) => (
          <SortButton key={sortOrdersName} sortOrdersName={sortOrdersName} />
        ))}
      </div>
    </div>
  )
}

export default memo(SortBar)
