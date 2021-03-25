import {
  useEffect,
  useRef,
  useMemo
} from 'react'

import {
  useBody,
  useSupportGeometry,
} from '../physics'

export default function Brush ({
  id,
  support,
  size,
  position,
  kinematic,
  userData,
  ...rest
}) {
  position = position || [0.0, 0.0, 0.0]

  const options = useMemo(() => ({
    supports: [ support ],
    isKinematic: kinematic
  }), [support, kinematic])

  const ref = useRef()
  const api = useBody(ref, options)

  const [x, y, z] = position
  useEffect(() => {
    api.transform.setPosition(x, y, z)
    api.velocity.set(0, 0, 0)
    api.update()
  }, [api, x, y, z])

  const geometry = useSupportGeometry(support)

  return (
    <mesh ref={ref} geometry={geometry} {...rest}>
      <meshStandardMaterial />
    </mesh>
  )
}
