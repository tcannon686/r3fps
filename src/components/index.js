import Box from './Box'
import Sphere from './Sphere'
import Cylinder from './Cylinder'
import PointLight from './PointLight'
import AmbientLight from './AmbientLight'
import DirectionalLight from './DirectionalLight'

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
  cylinder: {
    displayName: 'Cylinder',
    component: Cylinder,
    inspectors: ['position', 'rotation', 'scale', 'cylinderSize', 'body']
  },
  pointLight: {
    displayName: 'Point Light',
    component: PointLight,
    inspectors: ['position', 'color']
  },
  ambientLight: {
    displayName: 'Ambient Light',
    component: AmbientLight,
    inspectors: ['position', 'color']
  },
  directionalLight: {
    displayName: 'Directional Light',
    component: DirectionalLight,
    inspectors: ['position', 'color']
  }
}
export default components
