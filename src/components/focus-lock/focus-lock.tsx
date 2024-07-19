import { FC, useEffect, useRef } from 'react'

const TAB_KEY = 'Tab'
const FOCUSABLE_ELEMENTS =
  'button:enabled, input:enabled, select:enabled, textarea:enabled, summary, iframe, object, embed, [href], [tabindex]:not([tabindex="-1"]), [contenteditable], [controls], [autofocus]'

interface FocusLockProperties extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

const FocusLock: FC<FocusLockProperties> = ({ children, ...otherProperties }) => {
  const rootNode = useRef<HTMLDivElement>(null)
  const focusableItems = useRef<Array<HTMLElement>>()

  useEffect(() => {
    if (!rootNode.current) return undefined

    const updateFocusableItems = (): void => {
      const focusableElements = rootNode.current?.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS)
      const visibleFocusableElements = [...(focusableElements ?? [])].filter((element) => element.offsetParent !== null)
      focusableItems.current = visibleFocusableElements
    }

    updateFocusableItems()

    const observer = new MutationObserver(() => {
      updateFocusableItems()
    })
    observer.observe(rootNode.current, { childList: true })

    return (): void => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent): void => {
      if (!focusableItems.current) return

      const { key, shiftKey } = event
      const { length, 0: firstItem, [length - 1]: lastItem } = focusableItems.current

      if (key === TAB_KEY) {
        if (length === 1) {
          event.preventDefault()
          return
        }

        if (!shiftKey && document.activeElement === lastItem) {
          event.preventDefault()
          firstItem.focus()
          return
        }

        if (shiftKey && document.activeElement === firstItem) {
          event.preventDefault()
          lastItem.focus()
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return (): void => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div ref={rootNode} {...otherProperties}>
      {children}
    </div>
  )
}

export default FocusLock
