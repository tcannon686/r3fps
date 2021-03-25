import {
  useEffect,
  useRef,
  useMemo
} from 'react'

import {
  useBody,
  useSupportGeometry,
} from '../physics'

import {
  Matrix4,
  Euler
} from 'three'

export default function Brush ({
  id,
  support,
  position,
  rotation,
  kinematic,
  userData,
  ...rest
}) {
  /* Default values. */
  position = position || [0.0, 0.0, 0.0]
  rotation = rotation || [0.0, 0.0, 0.0]

  const options = useMemo(() => ({
    supports: [ support ],
    isKinematic: kinematic
  }), [support, kinematic])

  const ref = useRef()
  const api = useBody(ref, options)

  const [rx, ry, rz] = rotation
  const [x, y, z] = position
  useEffect(() => {
    api.transform.identity()
    api.transform.multiply(
      new Matrix4().makeRotationFromEuler(new Euler(
        rx * Math.PI / 180,
        ry * Math.PI / 180,
        rz * Math.PI / 180))
    )
    api.transform.setPosition(x, y, z)
    api.velocity.set(0, 0, 0)
    api.update()
  }, [api, x, y, z, rx, ry, rz])

  const geometry = useSupportGeometry(support)

  return (
    <mesh ref={ref} geometry={geometry} {...rest}>
      <meshStandardMaterial />
    </mesh>
  )
}
