import { useRef, useCallback, useEffect, forwardRef } from 'react'
import { useThree, useFrame } from 'react-three-fiber'
import { useEventListener, useIsKeyDown } from '../hooks'
import { Vector3 } from 'three'

export default forwardRef(({
  position,
  mode,
  ...rest
}, ref) => {
  const rotationHelper = useRef()
  const { setDefaultCamera } = useThree()
  const speed = 3

  /* Handle mouselook. */
  const handleMouseMove = useCallback((e) => {
    if (mode === 'fps') {
      ref.current.rotation.x -= e.movementY * 0.005
      rotationHelper.current.rotation.y -= e.movementX * 0.005
    }
  }, [mode, ref])
  useEventListener('mousemove', handleMouseMove)

  const keyIsDown = useIsKeyDown()

  useEffect(() => {
    setDefaultCamera(ref.current)
  }, [setDefaultCamera, ref])

  const [x, y, z] = position
  useEffect(() => {
    rotationHelper.current.position.set(x, y, z)
  }, [x, y, z])

  const right = new Vector3()
  const up = new Vector3()
  const forward = new Vector3()

  useFrame((state, dt) => {
    /* Update the camera. */
    ref.current.updateMatrixWorld()
    if (mode === 'fps') {
      ref.current.matrixWorld.extractBasis(right, up, forward)
      forward.negate()
      if (keyIsDown.current.E) {
        rotationHelper.current.position.addScaledVector(up, dt * speed)
      }
      if (keyIsDown.current.Q) {
        rotationHelper.current.position.addScaledVector(up, -dt * speed)
      }
      if (keyIsDown.current.D) {
        rotationHelper.current.position.addScaledVector(right, dt * speed)
      }
      if (keyIsDown.current.A) {
        rotationHelper.current.position.addScaledVector(right, -dt * speed)
      }
      if (keyIsDown.current.W) {
        rotationHelper.current.position.addScaledVector(forward, dt * speed)
      }
      if (keyIsDown.current.S) {
        rotationHelper.current.position.addScaledVector(forward, -dt * speed)
      }
    }
  })

  return (
    <group ref={rotationHelper}>
      <perspectiveCamera ref={ref} />
    </group>
  )
})
