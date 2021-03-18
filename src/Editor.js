import { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { Canvas, useThree, useFrame } from 'react-three-fiber'
import { box } from 'collide'
import { Vector3 } from 'three'

import { useEventListener } from './hooks'

import {
  PhysicsScene,
  useBody,
  supportGeometry,
  useContacts
} from './physics'

import { useIsKeyDown } from './hooks'

const components = {}
export function registerComponent(type, displayName, component, inspector) {
  components[type] = {
    displayName,
    component,
    inspector
  }
}

function EditorCamera ({ position, mode, ...rest }) {
  const camera = useRef()
  const rotationHelper = useRef()
  const { setDefaultCamera } = useThree()
  const speed = 3

  /* Handle mouselook. */
  const handleMouseMove = useCallback((e) => {
    if (mode === 'fps') {
      camera.current.rotation.x -= e.movementY * 0.005
      rotationHelper.current.rotation.y -= e.movementX * 0.005
    }
  }, [mode])
  useEventListener('mousemove', handleMouseMove)

  const keyIsDown = useIsKeyDown()

  useEffect(() => {
    setDefaultCamera(camera.current)
  }, [setDefaultCamera])

  const [x, y, z] = position
  useEffect(() => {
    rotationHelper.current.position.set(x, y, z)
  }, [x, y, z])

  const right = new Vector3()
  const up = new Vector3()
  const forward = new Vector3()

  useFrame((state, dt) => {
    /* Update the camera. */
    camera.current.updateMatrixWorld()
    if (mode === 'fps') {
      camera.current.matrixWorld.extractBasis(right, up, forward)
      forward.negate()
      if (keyIsDown.current['E']) {
        rotationHelper.current.position.addScaledVector(up, dt * speed)
      }
      if (keyIsDown.current['Q']) {
        rotationHelper.current.position.addScaledVector(up, -dt * speed)
      }
      if (keyIsDown.current['D']) {
        rotationHelper.current.position.addScaledVector(right, dt * speed)
      }
      if (keyIsDown.current['A']) {
        rotationHelper.current.position.addScaledVector(right, -dt * speed)
      }
      if (keyIsDown.current['W']) {
        rotationHelper.current.position.addScaledVector(forward, dt * speed)
      }
      if (keyIsDown.current['S']) {
        rotationHelper.current.position.addScaledVector(forward, -dt * speed)
      }
    }
  })

  return (
    <group ref={rotationHelper}>
      <perspectiveCamera ref={camera}/>
    </group>
  )
}

function Box (props) {
  const {
    size,
    type,
    position,
    kinematic,
    ...rest
  } = props

  const [sizeX, sizeY, sizeZ] = size
  const support = useMemo(() => (
    box({ size: [sizeX, sizeY, sizeZ] })
  ), [sizeX, sizeY, sizeZ])
  const options = useMemo(() => ({
    supports: [ support ],
    isKinematic: kinematic
  }), [support, kinematic])

  const [ref, api] = useBody(options)

  const [x, y, z] = position
  useEffect(() => {
    api.transform.setPosition(x, y, z)
    api.update()
  }, [api, x, y, z])

  return (
    <mesh ref={ref} {...rest}>
      <supportGeometry args={[support]} />
      <meshStandardMaterial />
    </mesh>
  )
}

registerComponent('box', 'Box', Box)

function Scene ({ data }) {
  return (
    <>
      {data.objects.map(x => {
        const Component = components[x.type].component
        return (
          <Component key={x.id} {...x.props} />
        )
      })}
    </>
  )
}

function ThreeView ({ data }) {
  const [cameraMode, setCameraMode] = useState()

  const handleMouseDown = (e) => {
    if (e.buttons === 2) {
      setCameraMode('fps')
    }
  }

  const handleMouseUp = (e) => {
    setCameraMode()
  }
  useEventListener('mouseup', handleMouseUp)

  const handleContextMenu = (e) => {
    e.preventDefault()
  }

  return (
    <Canvas onMouseDown={handleMouseDown} onContextMenu={handleContextMenu}>
      <PhysicsScene>
        <directionalLight position={[1, 3, 2]} />
        <ambientLight />
        <EditorCamera position={[-2, 2, 0]} mode={cameraMode} />
        <Scene data={data} />
      </PhysicsScene>
    </Canvas>
  )
}

export default function Editor () {
  const data = {
    objects: [
      {
        type: 'box',
        id: 1,
        props: {
          size: [1, 1, 1],
          position: [0, 0, 0],
          kinematic: true
        }
      }
    ]
  }
  return (
    <ThreeView data={data} />
  )
}
