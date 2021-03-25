import Box from './Box'
import Sphere from './Sphere'

const components = {
  'box': {
    displayName: 'Box',
    component: Box,
    inspectors: ['position', 'boxSize']
  },
  'sphere': {
    displayName: 'Sphere',
    component: Sphere,
    inspectors: ['position', 'sphereSize']
  }
}
export default components
