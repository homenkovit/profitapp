import { useState, useLayoutEffect } from 'react'

const MOBILE_MAX_SIZE = 480

const getIsMobile = (): boolean => window.innerWidth <= MOBILE_MAX_SIZE

export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(getIsMobile())

  useLayoutEffect(() => {
    const windowListener = (): void => {
      if (getIsMobile()) {
        setIsMobile(true)
      } else {
        setIsMobile(false)
      }
    }

    window.addEventListener('resize', windowListener)

    return () => {
      window.removeEventListener('resize', windowListener)
    }
  }, [])

  return isMobile
}
