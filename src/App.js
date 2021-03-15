import { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { Canvas, useThree, useFrame } from 'react-three-fiber'
import { scene, body, box, sphere, hull, circle } from 'collide'
import logo from './logo.svg';
import './App.css';
import { Vector3 } from 'three'

import {
  PhysicsScene,
  useBody,
  SupportGeometry,
  useContacts
} from './physics.js'

function useEventListener(type, callback) {
  useEffect(() => {
    document.addEventListener(type, callback)
    return () => {
      document.removeEventListener(type, callback)
    }
  }, [type, callback])
}

function Player (props) {
  const camera = useRef()
  const rotationHelper = useRef()
  const { setDefaultCamera } = useThree()
  const {
    position,
    ...rest
  } = props
  const speed = 3
  const jumpSpeed = 3

  const [ref, api] = useBody(() => ({
    supports: [
      hull(
        sphere({ radius: 0.5 }),
        sphere({ position: [0, -1, 0], radius: 0.5})
      )
    ]
  }), [])
  useEffect(() => {
    api.transform.setPosition(...position)
    api.update()
  }, [api, position])

  const contacts = useContacts(api)

  /* Handle mouselook. */
  const handleMouseMove = useCallback((e) => {
    camera.current.rotation.x -= e.movementY * 0.005
    rotationHelper.current.rotation.y -= e.movementX * 0.005
  }, [])
  useEventListener('mousemove', handleMouseMove)

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

  useEffect(() => {
    setDefaultCamera(camera.current)
  }, [setDefaultCamera])

  const right = new Vector3()
  const up = new Vector3()
  const forward = new Vector3()

  useFrame((state, dt) => {
    /* Update the camera. */
    camera.current.updateMatrixWorld()
    rotationHelper.current.matrixWorld.extractBasis(right, up, forward)
    forward.negate()
    if (keyIsDown.current['E']) {
      api.position.addScaledVector(up, dt * speed)
      api.transform.setPosition(api.position)
      api.update()
    }
    if (keyIsDown.current['Q']) {
      api.position.addScaledVector(up, -dt * speed)
      api.transform.setPosition(api.position)
      api.update()
    }
    if (keyIsDown.current['D']) {
      api.position.addScaledVector(right, dt * speed)
      api.transform.setPosition(api.position)
      api.update()
    }
    if (keyIsDown.current['A']) {
      api.position.addScaledVector(right, -dt * speed)
      api.transform.setPosition(api.position)
      api.update()
    }
    if (keyIsDown.current['W']) {
      api.position.addScaledVector(forward, dt * speed)
      api.transform.setPosition(api.position)
      api.update()
    }
    if (keyIsDown.current['S']) {
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
    <group ref={ref}>
      <group ref={rotationHelper}>
        <perspectiveCamera ref={camera}/>
      </group>
    </group>
  )
}
function Cube (props) {
  const {
    args,
    type,
    position,
    kinematic,
    ...rest
  } = props
  const [ref, api] = useBody(() => ({
    supports: [
      box({
        size: args,
      })
    ],
    isKinematic: kinematic
  }), [])
  useEffect(() => {
    api.transform.setPosition(...position)
    api.update()
  }, [api, position])
  return (
    <mesh ref={ref}>
      <SupportGeometry support={box({ size: args })} />
      <meshStandardMaterial color='hotpink' />
    </mesh>
  )
}

function App() {
  const cubes = useMemo(() => {
    const ret = []
    for (let i = 0; i < 4; i ++) {
      for (let j = 0; j < 4; j ++) {
        for (let k = 0; k < 4; k ++) {
          ret.push(
            <Cube
              position={[i, j + 3, k]}
              args={[0.5, 0.5, 0.5]}
              key={i + ' ' + j + ' ' + k}
              kinematic
            />
          )
        }
      }
    }
    return ret
  }, [])
  return (
    <div className='App'>
      <Canvas onClick={(e) => {
        e.target.requestPointerLock()
      }}>
        <PhysicsScene>
          <directionalLight position={[1, 3, 2]} />
          <ambientLight />
          <Cube args={[8, 1, 8]} position={[0, -0.5, 0]} kinematic />
          <Player position={[-2, 0, 0]} />
          <mesh>
            <SupportGeometry
              support={hull(
                circle({position: [0, 2, 0], radius: 1}),
                circle({position: [0, 4, 0], radius: 0.2}),
              )}
            />
            <meshStandardMaterial color='hotpink' />
          </mesh>
        </PhysicsScene>
      </Canvas>
    </div>
  );
}

export default App;
