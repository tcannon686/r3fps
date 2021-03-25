import {
  useMemo
} from 'react'

import {
  box
} from 'collide'

import Brush from './Brush'

export default function Box ({ size, ...rest }) {
  size = size || [1.0, 1.0, 1.0]
  const [sizeX, sizeY, sizeZ] = size
  const support = useMemo(() => (
    box({ size: [sizeX, sizeY, sizeZ] })
  ), [sizeX, sizeY, sizeZ])
  return (
    <Brush support={support} {...rest} />
  )
}
