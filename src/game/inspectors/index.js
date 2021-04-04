import Position from './Position'
import BoxSize from './BoxSize'
import SphereSize from './SphereSize'
import CylinderSize from './CylinderSize'
import RoundBrush from './RoundBrush'
import Body from './Body'
import Rotation from './Rotation'
import Scale from './Scale'
import Color from './Color'

const inspectors = {
  position: {
    displayName: 'Position',
    component: Position
  },
  boxSize: {
    displayName: 'Size',
    component: BoxSize
  },
  sphereSize: {
    displayName: 'Size',
    component: SphereSize
  },
  cylinderSize: {
    displayName: 'Size',
    component: CylinderSize
  },
  body: {
    displayName: 'Body',
    component: Body
  },
  rotation: {
    displayName: 'Rotation',
    component: Rotation
  },
  scale: {
    displayName: 'Scale',
    component: Scale
  },
  color: {
    displayName: 'Color',
    component: Color
  },
  roundBrush: {
    displayName: 'Round Brush',
    component: RoundBrush
  }
}

const mixins = {
  transform: ['position', 'rotation', 'scale'],
  brush: ['position', 'rotation', 'scale', 'body'],
  roundBrush: ['position', 'rotation', 'scale', 'body', 'roundBrush']
}

export { mixins }

export default inspectors
