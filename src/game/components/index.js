import Box from './Box'
import Sphere from './Sphere'
import Cylinder from './Cylinder'
import PointLight from './PointLight'
import AmbientLight from './AmbientLight'
import DirectionalLight from './DirectionalLight'

import * as mixins from '../inspectors/mixins'

import position from '../inspectors/position'
import boxSize from '../inspectors/boxSize'
import sphereSize from '../inspectors/sphereSize'
import cylinderSize from '../inspectors/cylinderSize'
import color from '../inspectors/color'

const components = {
  box: {
    displayName: 'Box',
    component: Box,
    inspectors: [...mixins.roundBrush, boxSize]
  },
  sphere: {
    displayName: 'Sphere',
    component: Sphere,
    inspectors: [...mixins.brush, sphereSize]
  },
  cylinder: {
    displayName: 'Cylinder',
    component: Cylinder,
    inspectors: [...mixins.roundBrush, cylinderSize]
  },
  pointLight: {
    displayName: 'Point Light',
    component: PointLight,
    inspectors: [position, color]
  },
  ambientLight: {
    displayName: 'Ambient Light',
    component: AmbientLight,
    inspectors: [position, color]
  },
  directionalLight: {
    displayName: 'Directional Light',
    component: DirectionalLight,
    inspectors: [position, color]
  }
}
export default components
