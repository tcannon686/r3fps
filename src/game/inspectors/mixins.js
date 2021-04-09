import position from './position'
import rotation from './rotation'
import scale from './scale'
import body from './body'
import color from './color'
import roundBrushInspector from './roundBrush'

const transform = [position, rotation, scale]
const brush = [position, rotation, scale, body, color]
const roundBrush = [...brush, roundBrushInspector]

export { transform, brush, roundBrush }
