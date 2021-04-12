import {
  useMemo
} from 'react'

import {
  box
} from 'tcollide'

import RoundBrush from './RoundBrush'

import * as mixins from '../inspectors/mixins'
import boxSize from '../inspectors/boxSize'

function Box ({ size, ...rest }) {
  size = size || [1.0, 1.0, 1.0]
  const [sizeX, sizeY, sizeZ] = size
  const support = useMemo(() => (
    box({ size: [sizeX, sizeY, sizeZ] })
  ), [sizeX, sizeY, sizeZ])
  return (
    <RoundBrush support={support} {...rest} />
  )
}

const component = {
  key: 'box',
  displayName: 'Box',
  inspectors: [...mixins.roundBrush, boxSize],
  component: Box
}

export default component
