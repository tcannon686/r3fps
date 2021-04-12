import {
  useMemo
} from 'react'

import {
  hull,
  circle
} from 'tcollide'

import RoundBrush from './RoundBrush'

import * as mixins from '../inspectors/mixins'
import cylinderSize from '../inspectors/cylinderSize'

function Cylinder ({ height, r1, r2, ...rest }) {
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
    <RoundBrush support={support} {...rest} />
  )
}

const component = {
  key: 'cylinder',
  displayName: 'Cylinder',
  inspectors: [...mixins.roundBrush, cylinderSize],
  component: Cylinder
}

export default component
