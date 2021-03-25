import { useEffect, useRef, useCallback } from 'react'

export function useEventListener (type, callback) {
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

/**
 * Creates a callback function that calls the given callback by reference. This
 * is useful when multiple components need to use the same callback, and you
 * don't want to trigger a rerender of all the components when the callback
 * changes. Returns the memoized callback.
 */
export const useRefCallback = (callback) => {
  const ref = useRef(null)
  const memoizedCallback = useCallback(
    (...args) => ref.current(...args),
    []
  )

  useEffect(() => {
    ref.current = callback
  }, [callback])

  return memoizedCallback
}
