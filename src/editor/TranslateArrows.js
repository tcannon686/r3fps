/* React. */
import {
  useCallback,
  useState,
  useRef,
  useMemo,
  useEffect
} from 'react'

/* react-three-fiber. */
import { useThree, useFrame } from 'react-three-fiber'

/* three.js */
import {
  Vector3,
  Scene
} from 'three'

import { useArrowGeometry } from '../hooks'

/*
 * An arrow in a single direction.
 */
function TranslateArrow ({
  onBeginDrag,
  onEndDrag,
  onDrag,
  color,
  direction,
  ...rest
}) {
  const arrowGeometry = useArrowGeometry()
  const [isHovering, setIsHovering] = useState()

  const [dx, dy, dz] = direction
  const rotation = [
    Math.atan2(Math.sqrt(dx ** 2 + dz ** 2), dy),
    0,
    Math.atan2(-dx, dz)
  ]
  const handlePointerOver = useCallback((...args) => {
    setIsHovering(true)
  }, [setIsHovering])
  const handlePointerLeave = useCallback((...args) => {
    setIsHovering(false)
  }, [setIsHovering])
  const totalAmount = useRef(new Vector3())

  const ref = useRef()

  /* Dragging. */
  const [isDragging, setIsDragging] = useState(false)
  const handlePointerDown = useCallback((e) => {
    e.stopPropagation()
    e.target.setPointerCapture(e.pointerId)
    setIsDragging(true)
    totalAmount.current.set(0, 0, 0)
    if (onBeginDrag) {
      onBeginDrag()
    }
  }, [setIsDragging, onBeginDrag])

  const handlePointerUp = useCallback((e) => {
    e.stopPropagation()
    e.target.releasePointerCapture(e.pointerId)
    setIsDragging(false)
    if (onEndDrag) {
      onEndDrag(totalAmount.current.clone())
    }
  }, [setIsDragging, onEndDrag])

  /* Calculating direction. */
  const { camera, size } = useThree()

  const handlePointerMove = useCallback((e) => {
    const b = new Vector3()
    const v = new Vector3(dx, dy, dz)
    if (isDragging) {
      ref.current.getWorldPosition(b)

      v.add(b)
      v.project(camera)
      b.project(camera)

      v.sub(b)
      const len = Math.sqrt(v.x ** 2 + v.y ** 2)
      v.multiplyScalar(1 / len)
      const dot = (
        2 * v.x * e.movementX / size.width -
        2 * v.y * e.movementY / size.height
      )

      v.multiplyScalar(dot)
      v.add(b)
      v.unproject(camera)
      b.unproject(camera)
      v.sub(b)

      if (onDrag) {
        totalAmount.current.add(v)
        onDrag(v)
      }
    }
  }, [isDragging, onDrag, camera, dx, dy, dz, size])

  return (
    <mesh
      geometry={arrowGeometry}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerOver={handlePointerOver}
      onPointerLeave={handlePointerLeave}
      rotation={rotation}
      ref={ref}
      renderOrder={1000}
      {...rest}
    >
      <meshBasicMaterial
        color={(isHovering || isDragging) ? '#ffbb22' : color}
      />
    </mesh>
  )
}

export default function TranslateArrows ({
  position,
  onDrag,
  onBeginDrag,
  onEndDrag
}) {
  const ref = useRef()

  /* Callbacks. */
  const handleBeginDrag = useCallback(() => {
    if (onBeginDrag) {
      onBeginDrag()
    }
  }, [onBeginDrag])

  const handleEndDrag = useCallback((amount) => {
    if (onEndDrag) {
      onEndDrag(amount)
    }
  }, [onEndDrag])

  const handleDrag = useCallback((v) => {
    if (onDrag) {
      onDrag(v)
    }
  }, [onDrag])

  const { camera, gl, scene } = useThree()

  /*
   * Add the arrows to its own scene so that they can be rendered on top of the
   * editor.
   */
  const arrowScene = useMemo(() => new Scene(), [])
  useEffect(() => {
    arrowScene.clear()
    arrowScene.add(ref.current)
  }, [scene, ref, arrowScene])

  /* Scale so that the arrows have a constant size on the screen. */
  const worldPos = new Vector3()
  useFrame(() => {
    ref.current.getWorldPosition(worldPos)
    worldPos.applyMatrix4(camera.matrixWorldInverse)
    const scale = -0.1 * worldPos.z
    ref.current.scale.set(scale, scale, scale)

    /* Render the arrows on top of the scene. */
    gl.clearDepth()
    gl.render(arrowScene, camera)
  }, 2)

  const directions = [
    [[1, 0, 0], '#ff0000'],
    [[0, 1, 0], '#00ff00'],
    [[0, 0, 1], '#0000ff']
  ]

  return (
    <group ref={ref} position={position}>
      {directions.map(([direction, color], i) => (
        <TranslateArrow
          key={i}
          direction={direction}
          color={color}
          onDrag={handleDrag}
          onBeginDrag={handleBeginDrag}
          onEndDrag={handleEndDrag}
        />
      ))}
    </group>
  )
}
