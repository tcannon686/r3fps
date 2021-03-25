import Box from './Box'
import Sphere from './Sphere'

const components = {
  box: {
    displayName: 'Box',
    component: Box,
    inspectors: ['position', 'rotation', 'boxSize', 'body']
  },
  sphere: {
    displayName: 'Sphere',
    component: Sphere,
    inspectors: ['position', 'rotation', 'sphereSize', 'body']
  }
}
export default components
