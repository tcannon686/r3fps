import {
  useMemo
} from 'react'

import {
  sphere
} from 'tcollide'

import Brush from './Brush'

import * as mixins from '../inspectors/mixins'
import sphereSize from '../inspectors/sphereSize'

function Sphere ({ radius, ...rest }) {
  radius = radius || 0.5
  const support = useMemo(() => (
    sphere({ radius })
  ), [radius])
  return (
    <Brush support={support} {...rest} />
  )
}

const component = {
  key: 'sphere',
  displayName: 'Sphere',
  inspectors: [...mixins.brush, sphereSize],
  component: Sphere
}

export default component
