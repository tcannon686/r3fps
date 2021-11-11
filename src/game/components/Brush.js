import {
  useEffect,
  useRef,
  useMemo
} from 'react'

import {
  useBody,
  useSupportGeometry
} from '../../physics'

import {
  Matrix4,
  Euler
} from 'three'

export default function Brush ({
  support,
  position,
  rotation,
  scale,
  kinematic,
  userData,
  color,
  visible,
  inEditor,
  enableBody,
  ...rest
}) {
  /* Default values. */
  position = position || [0.0, 0.0, 0.0]
  rotation = rotation || [0.0, 0.0, 0.0]
  scale = scale || [1.0, 1.0, 1.0]
  visible = visible === undefined ? true : visible

  const options = useMemo(() => ({
    supports: [support],
    isKinematic: kinematic
  }), [support, kinematic])

  const ref = useRef()
  const api = useBody(ref, options, enableBody)

  const [rx, ry, rz] = rotation
  const [sx, sy, sz] = scale
  const [x, y, z] = position
  useEffect(() => {
    api.transform.identity()
    api.transform.multiply(
      new Matrix4().makeRotationFromEuler(new Euler(
        rx * Math.PI / 180,
        ry * Math.PI / 180,
        rz * Math.PI / 180))
    )
    api.transform.multiply(
      new Matrix4().makeScale(sx, sy, sz)
    )
    api.transform.setPosition(x, y, z)
    api.velocity.set(0, 0, 0)
    api.update()
  }, [api, x, y, z, rx, ry, rz, sx, sy, sz])

  const geometry = useSupportGeometry(support)

  if (visible || inEditor) {
    return (
      <mesh
        ref={ref}
        geometry={geometry}
        position={position}
        rotation={rotation}
        scale={scale}
        {...rest}
      >
        <meshStandardMaterial
          color={color}
        />
      </mesh>
    )
  } else {
    return null
  }
}
