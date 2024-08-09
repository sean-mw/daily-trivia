'use client'

import { useState, useEffect, useCallback } from 'react'

export enum Breakpoint {
  SMALL,
  MEDIUM,
  LARGE,
  XLARGE,
}

const useBreakpoint = (): Breakpoint => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>()

  const getBreakpoint = useCallback(() => {
    const width = window.innerWidth

    if (width < 640) {
      return Breakpoint.SMALL
    } else if (width >= 640 && width < 768) {
      return Breakpoint.MEDIUM
    } else if (width >= 768 && width < 1024) {
      return Breakpoint.LARGE
    } else {
      return Breakpoint.XLARGE
    }
  }, [])

  useEffect(() => {
    setBreakpoint(getBreakpoint())

    const handleResize = () => {
      setBreakpoint(getBreakpoint())
    }

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [getBreakpoint])

  return breakpoint || Breakpoint.SMALL
}

export default useBreakpoint
