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
      ref.current.rotation.x -= e.movementY * 0.0025
      rotationHelper.current.rotation.y -= e.movementX * 0.0025
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
      const totalSpeed = speed * (keyIsDown.current.Shift ? 4 : 1)
      const position = rotationHelper.current.position
      ref.current.matrixWorld.extractBasis(right, up, forward)
      forward.negate()
      if (keyIsDown.current.E) {
        position.addScaledVector(up, dt * totalSpeed)
      }
      if (keyIsDown.current.Q) {
        position.addScaledVector(up, -dt * totalSpeed)
      }
      if (keyIsDown.current.D) {
        position.addScaledVector(right, dt * totalSpeed)
      }
      if (keyIsDown.current.A) {
        position.addScaledVector(right, -dt * totalSpeed)
      }
      if (keyIsDown.current.W) {
        position.addScaledVector(forward, dt * totalSpeed)
      }
      if (keyIsDown.current.S) {
        position.addScaledVector(forward, -dt * totalSpeed)
      }
    }
  })

  return (
    <group ref={rotationHelper}>
      <perspectiveCamera ref={ref} fov={75.0} />
    </group>
  )
})
