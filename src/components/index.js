import Box from './Box'
import Sphere from './Sphere'
import PointLight from './PointLight'

const components = {
  box: {
    displayName: 'Box',
    component: Box,
    inspectors: ['position', 'rotation', 'scale', 'boxSize', 'body']
  },
  sphere: {
    displayName: 'Sphere',
    component: Sphere,
    inspectors: ['position', 'rotation', 'scale', 'sphereSize', 'body']
  },
  pointLight: {
    displayName: 'Point Light',
    component: PointLight,
    inspectors: ['position', 'color']
  }
}
export default components
