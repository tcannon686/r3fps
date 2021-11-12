import position from './position'
import rotation from './rotation'
import scale from './scale'
import body from './body'
import color from './color'
import roundBrushInspector from './roundBrush'
import visibility from './visibility'
import model from './model'

const transform = [position, rotation, scale]
const brush = [position, rotation, scale, body, color, visibility, model]
const roundBrush = [...brush, roundBrushInspector]
const light = [position, color]

export { transform, brush, roundBrush, light }
