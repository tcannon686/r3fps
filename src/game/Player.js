import { v4 as uuid } from 'uuid'
import { sphere, circle, hull } from 'tcollide'
import { useThree, useFrame } from 'react-three-fiber'
import { useCallback, useEffect, useRef, useMemo, useState } from 'react'
import { useBody, useContacts } from '../physics'
import { useEventListener, useIsKeyDown } from '../hooks'
import { Vector3 } from 'three'

function Snowball ({ position, direction, speed }) {
  const ref = useRef()
  const options = useMemo(() => ({
    supports: [
      sphere({ radius: 0.25 })
    ]
  }), [])
  const api = useBody(ref, options)

  const [x, y, z] = position
  const [dx, dy, dz] = direction

  useEffect(() => {
    api.transform.setPosition(x + dx, y + dy, z + dz)
    api.update()
  }, [api, x, y, z, dx, dy, dz])

  useEffect(() => {
    api.velocity.set(dx * speed, dy * speed, dz * speed)
    api.update()
  }, [api, dx, dy, dz, speed])

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.25, 16, 8]} />
      <meshStandardMaterial color='white' />
    </mesh>
  )
}

export default function Player ({ position, rotation, ...rest }) {
  position = position || [0, 0, 0]
  rotation = rotation || [0, 0, 0]

  const camera = useRef()
  const rotationHelper = useRef()
  const { setDefaultCamera } = useThree()
  const speed = 5
  const jumpSpeed = 3

  const ref = useRef()
  const options = useMemo(() => ({
    supports: [
      hull(
        circle({ position: [0, 0.25, 0], radius: 0.25 }),
        circle({ position: [0, -1.25, 0], radius: 0.25 })
      )
    ]
  }), [])
  const api = useBody(ref, options)
  const [bullets, setSnowballs] = useState([])

  const [x, y, z] = position
  useEffect(() => {
    api.transform.setPosition(x, y, z)
    api.update()
  }, [api, x, y, z])

  const [rx, ry, rz] = rotation
  useEffect(() => {
    rotationHelper.current.rotation.y = ry * Math.PI / 180
  }, [rx, ry, rz])

  const contacts = useContacts(api)

  /* Handle mouselook. */
  const handleMouseMove = useCallback((e) => {
    if (camera.current) {
      const rx = camera.current.rotation.x
      camera.current.rotation.x = Math.min(
        Math.max(
          rx - e.movementY * 0.0025, -Math.PI / 2
        ),
        Math.PI / 2
      )
      rotationHelper.current.rotation.y -= e.movementX * 0.0025
    }
  }, [])
  useEventListener('mousemove', handleMouseMove)

  useEffect(() => {
    setDefaultCamera(camera.current)
  }, [setDefaultCamera])

  const keyIsDown = useIsKeyDown()

  const right = new Vector3()
  const up = new Vector3()
  const forward = new Vector3()
  const cameraForward = new Vector3()

  const handleMouseDown = () => {
    setSnowballs([...bullets, {
      key: uuid(),
      position: [api.position.x, api.position.y, api.position.z],
      direction: [cameraForward.x, cameraForward.y, cameraForward.z],
      speed: 15
    }].slice(-10))
  }
  useEventListener('mousedown', handleMouseDown)

  useFrame((state, dt) => {
    /* Update the camera. */
    camera.current.updateMatrixWorld()
    cameraForward.setFromMatrixColumn(camera.current.matrixWorld, 2)
    cameraForward.negate()
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
        contacts.current.length > 0 &&
        contacts.current.some(x => x.amount.y / x.amount.length() < -0.5)
      ) {
        api.velocity.set(0, jumpSpeed, 0)
      }
    }
  })

  return (
    <>
      <group ref={ref} {...rest}>
        <group ref={rotationHelper}>
          <perspectiveCamera ref={camera} fov={75} />
        </group>
      </group>
      {bullets.map(({ key, ...props }) => (
        <Snowball key={key} {...props} />
      ))}
    </>
  )
}
