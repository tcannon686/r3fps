import {
  useMemo
} from 'react'

import {
  box
} from 'tcollide'

import RoundBrush from './RoundBrush'

export default function Box ({ size, ...rest }) {
  size = size || [1.0, 1.0, 1.0]
  const [sizeX, sizeY, sizeZ] = size
  const support = useMemo(() => (
    box({ size: [sizeX, sizeY, sizeZ] })
  ), [sizeX, sizeY, sizeZ])
  return (
    <RoundBrush support={support} {...rest} />
  )
}
