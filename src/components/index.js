import Box from './Box'
import Sphere from './Sphere'

const components = {
  'box': {
    displayName: 'Box',
    component: Box,
    inspectors: ['position']
  },
  'sphere': {
    displayName: 'Sphere',
    component: Sphere,
    inspectors: ['position']
  }
}
export default components
