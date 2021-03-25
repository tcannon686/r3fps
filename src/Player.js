import { sphere, hull } from 'collide'
import { useThree, useFrame } from 'react-three-fiber'
import { useCallback, useEffect, useRef } from 'react'
import { useBody, useContacts } from 'physics'
import { useEventListener, useIsKeyDown } from 'hooks'
import { Vector3 } from 'three'

export default function Player (props) {
  const camera = useRef()
  const rotationHelper = useRef()
  const { setDefaultCamera } = useThree()
  const {
    position,
    ...rest
  } = props
  const speed = 3
  const jumpSpeed = 3

  const ref = useRef()
  const api = useBody(ref, () => ({
    supports: [
      hull(
        sphere({ radius: 0.5 }),
        sphere({ position: [0, -1, 0], radius: 0.5 })
      )
    ]
  }), [])

  const [x, y, z] = position
  useEffect(() => {
    api.transform.setPosition(x, y, z)
    api.update()
  }, [api, x, y, z])

  const contacts = useContacts(api)

  /* Handle mouselook. */
  const handleMouseMove = useCallback((e) => {
    camera.current.rotation.x -= e.movementY * 0.005
    rotationHelper.current.rotation.y -= e.movementX * 0.005
  }, [])
  useEventListener('mousemove', handleMouseMove)

  useEffect(() => {
    setDefaultCamera(camera.current)
  }, [setDefaultCamera])

  const keyIsDown = useIsKeyDown()

  const right = new Vector3()
  const up = new Vector3()
  const forward = new Vector3()

  useFrame((state, dt) => {
    /* Update the camera. */
    camera.current.updateMatrixWorld()
    rotationHelper.current.matrixWorld.extractBasis(right, up, forward)
    forward.negate()
    if (keyIsDown.current.E) {
      api.position.addScaledVector(up, dt * speed)
      api.transform.setPosition(api.position)
      api.update()
    }
    if (keyIsDown.current.Q) {
      api.position.addScaledVector(up, -dt * speed)
      api.transform.setPosition(api.position)
      api.update()
    }
    if (keyIsDown.current.D) {
      api.position.addScaledVector(right, dt * speed)
      api.transform.setPosition(api.position)
      api.update()
    }
    if (keyIsDown.current.A) {
      api.position.addScaledVector(right, -dt * speed)
      api.transform.setPosition(api.position)
      api.update()
    }
    if (keyIsDown.current.W) {
      api.position.addScaledVector(forward, dt * speed)
      api.transform.setPosition(api.position)
      api.update()
    }
    if (keyIsDown.current.S) {
      api.position.addScaledVector(forward, -dt * speed)
      api.transform.setPosition(api.position)
      api.update()
    }
    /* Jump. */
    if (keyIsDown.current[' ']) {
      if (
        contacts.length > 0 &&
        contacts.some(x => x.amount.y / x.amount.length() < -0.5)
      ) {
        api.velocity.set(0, jumpSpeed, 0)
      }
    }
  })

  return (
    <group ref={ref} {...rest}>
      <group ref={rotationHelper}>
        <perspectiveCamera ref={camera} />
      </group>
    </group>
  )
}
