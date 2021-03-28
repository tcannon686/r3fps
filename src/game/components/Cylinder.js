import {
  useMemo
} from 'react'

import {
  hull,
  circle
} from 'tcollide'

import Brush from './Brush'

export default function Cylinder ({ height, r1, r2, ...rest }) {
  /* Default values. */
  r1 = r1 || 0.5
  r2 = r2 || 0.5
  height = height || 1.0

  const support = useMemo(() => (
    hull(
      circle({
        position: [0, -height / 2, 0],
        radius: r1
      }),
      circle({
        position: [0, height / 2, 0],
        radius: r2
      })
    )
  ), [height, r1, r2])
  return (
    <Brush support={support} {...rest} />
  )
}
