import { useState, useEffect, useRef, useCallback } from 'react'

/* Utils. */
import { makeArrowGeometry } from '../utils'

const arrowGeometry = makeArrowGeometry()
export function useArrowGeometry () {
  return arrowGeometry
}

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
    keyIsDown.current[
      e.key.length === 1
        ? e.key.toUpperCase()
        : e.key
    ] = true
  }, [])
  useEventListener('keydown', handleKeyDown)

  const handleKeyUp = useCallback((e) => {
    keyIsDown.current[
      e.key.length === 1
        ? e.key.toUpperCase()
        : e.key
    ] = false
  }, [])

  useEventListener('keyup', handleKeyUp)
  return keyIsDown
}

export function useKeyboardShortcut (keys, callback) {
  /* Handle keyboard. */
  const keyIsDown = useRef({})

  const handleKeyDown = useCallback((e) => {
    keyIsDown.current[
      e.key.length === 1
        ? e.key.toUpperCase()
        : e.key
    ] = true

    /* Call the callback if all the keys are down. */
    if (e.target === document.body) {
      if (
        keys.every(x => keyIsDown.current[x]) &&
        Object.keys(keyIsDown.current)
          .filter(x => keyIsDown.current[x])
          .every(x => keys.includes(x))
      ) {
        callback()
      }
    }
  }, [keys, callback])
  useEventListener('keydown', handleKeyDown)

  const handleKeyUp = useCallback((e) => {
    keyIsDown.current[
      e.key.length === 1
        ? e.key.toUpperCase()
        : e.key
    ] = false
  }, [])
  useEventListener('keyup', handleKeyUp)
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

/**
 * Creates undoable state. Returns an array of [present, pushState, undo, redo,
 * setState]. pushState pushes the given state onto the stack. setState allows
 * you to set the state without modifying the history.
 */
export const useUndoable = (initialState, max) => {
  const [state, setState] = useState(initialState)
  const [present, setPresent] = useState(initialState)
  const [past, setPast] = useState([])
  const [future, setFuture] = useState([])

  const undo = useCallback(() => {
    const canUndo = past.length > 0
    if (canUndo) {
      setFuture([present, ...future])
      setPresent(past[0])
      setState(past[0])
      setPast(past.slice(1))
    }
  }, [present, past, future, setPresent, setPast, setFuture])

  const redo = useCallback(() => {
    const canRedo = future.length > 0
    if (canRedo) {
      setPast([present, ...past])
      setPresent(future[0])
      setState(future[0])
      setFuture(future.slice(1))
    }
  }, [present, past, future, setPresent, setPast, setFuture])

  const pushState = useCallback((state) => {
    setPast([present, ...past].splice(-(max || 1000)))
    setPresent(state)
    setState(state)
    setFuture([])
  }, [present, past, setPresent, setPast, setFuture, max])

  return [state, pushState, undo, redo, setState]
}
