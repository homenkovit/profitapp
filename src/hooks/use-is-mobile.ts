import { useState, useLayoutEffect } from 'react'

const MOBILE_MAX_SIZE = 480

const getIsMobileInitial = (): boolean => window.innerWidth <= MOBILE_MAX_SIZE

export const useIsMobile = (): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(getIsMobileInitial)

  useLayoutEffect(() => {
    const matchMedia = window.matchMedia(`(max-width: ${MOBILE_MAX_SIZE}px)`)
    setIsMobile(matchMedia.matches)

    const handleChange = (event: MediaQueryListEvent): void => {
      setIsMobile(event.matches)
    }

    matchMedia.addEventListener('change', handleChange)

    return (): void => {
      matchMedia.removeEventListener('change', handleChange)
    }
  }, [])

  return isMobile
}
