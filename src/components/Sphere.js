import {
  useMemo
} from 'react'

import {
  sphere
} from 'collide'

import Brush from './Brush'

export default function Sphere ({ radius, ...rest }) {
  radius = radius || 0.5
  const support = useMemo(() => (
    sphere({ radius })
  ), [radius])
  return (
    <Brush support={support} {...rest} />
  )
}
