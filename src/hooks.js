import { useEffect, useRef, useCallback } from 'react'

export function useEventListener(type, callback) {
  useEffect(() => {
    document.addEventListener(type, callback)
    return () => {
      document.removeEventListener(type, callback)
    }
  }, [type, callback])
}

export function useIsKeyDown () {
  /* Handle keyboard. */
  const keyIsDown = useRef({})
  const handleKeyDown = useCallback((e) => {
    keyIsDown.current[e.key.toUpperCase()] = true
  }, [])
  useEventListener('keydown', handleKeyDown)
  const handleKeyUp = useCallback((e) => {
    keyIsDown.current[e.key.toUpperCase()] = false
  }, [])
  useEventListener('keyup', handleKeyUp)
  return keyIsDown
}

