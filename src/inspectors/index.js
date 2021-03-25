import Position from './Position'
import BoxSize from './BoxSize'
import SphereSize from './SphereSize'
import Body from './Body'

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
  },
  'body': {
    displayName: 'Body',
    component: Body
  }
}

export default inspectors
