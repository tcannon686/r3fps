import {
  useEffect,
  useRef,
  useMemo
} from 'react'

import {
  useBody,
  supportGeometry,
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

  userData = {
    ...userData,
    id
  }

  return (
    <mesh ref={ref} {...rest} userData={userData}>
      <supportGeometry args={[support]} />
      <meshStandardMaterial />
    </mesh>
  )
}
