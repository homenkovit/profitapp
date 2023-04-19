import { FC, ReactNode, memo } from 'react'
import { createPortal } from 'react-dom'

import { TOP_BAR_PORTAL_ID } from './constants'

const TopBarPortal: FC<{ children: ReactNode }> = ({ children }) => {
  const topBarPortal = document.querySelector(`#${TOP_BAR_PORTAL_ID}`)

  if (topBarPortal) {
    return createPortal(children, topBarPortal)
  }

  return null
}

export default memo(TopBarPortal)
