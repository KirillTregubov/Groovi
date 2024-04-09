import { useCallback, useEffect, useState } from 'react'

export default function useVisibility() {
  const [isVisible, setIsVisible] = useState(true)

  const handleVisibilityChange = useCallback(() => {
    setIsVisible(document.visibilityState === 'visible')
  }, [])

  useEffect(() => {
    if (!document) {
      return
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [handleVisibilityChange])

  return isVisible
}
