import Position from './Position'
import BoxSize from './BoxSize'
import SphereSize from './SphereSize'

const inspectors = {
  'position': {
    displayName: 'Position',
    component: Position
  },
  'boxSize': {
    displayName: 'Size',
    component: BoxSize
  },
  'sphereSize': {
    displayName: 'Size',
    component: SphereSize
  }
}

export default inspectors
