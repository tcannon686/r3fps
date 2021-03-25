import Box from './Box'
import Sphere from './Sphere'

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
  }
}
export default components
