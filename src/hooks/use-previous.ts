import { useEffect, useRef } from 'react'

export const usePrevious = <T>(data: T): T => {
  const previous = useRef(data)

  useEffect(() => {
    previous.current = data
  }, [data])

  return previous.current
}
