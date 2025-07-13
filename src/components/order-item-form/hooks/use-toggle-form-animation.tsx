import { useCallback, useEffect, useState, useRef } from 'react'

import { Order } from 'contexts/order-context'

interface UseToggleFormAnimationReturn {
  animation: string
  closeFormWithAnimation: () => void
}

const CLOSE_TIMEOUT = 300

export const useToggleFormAnimation = (onClose: () => void, data?: Order): UseToggleFormAnimationReturn => {
  const openFormAnimationClass = data ? 'openEdit' : 'open'
  const closeFormAnimationClass = data ? 'closeEdit' : 'close'

  const [animation, setAnimation] = useState<string>(openFormAnimationClass)

  const closeFormWithAnimation = useCallback((): void => {
    setAnimation(closeFormAnimationClass)
    setTimeout(onClose, CLOSE_TIMEOUT)
  }, [closeFormAnimationClass, onClose])

  return {
    animation,
    closeFormWithAnimation,
  }
}

export default useToggleFormAnimation
