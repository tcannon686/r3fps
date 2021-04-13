import {
  useMemo
} from 'react'

import {
  box
} from 'tcollide'

import Box from '@material-ui/core/Box'

import Brush from './Brush'

import * as mixins from '../inspectors/mixins'
import boxSize from '../inspectors/boxSize'
import Vector2Property from '../inspectors/Vector2Property'

function makeWallSupports ({
  thickness,
  axisIndex,
  side,
  size,
  doorSize
}) {
  if (doorSize.some(x => x <= 0) || axisIndex === 1) {
    const sizeX = (
      axisIndex === 0
        ? thickness
        : (size[0] - 2 * thickness)
    )
    const sizeY = (
      axisIndex === 1
        ? thickness
        : (size[1])
    )
    const sizeZ = (
      axisIndex === 2
        ? thickness
        : (
            axisIndex === 0
              ? size[2]
              : size[2] - 2 * thickness
          )
    )
    const position = [0, 0, 0]
    position[axisIndex] = (size[axisIndex] - thickness) * side / 2
    return [
      box({
        position,
        size: [sizeX, sizeY, sizeZ]
      })
    ]
  } else {
    const sizeX = (
      axisIndex === 0
        ? thickness
        : (size[0] - 2 * thickness)
    )
    const sizeY = (
      axisIndex === 1
        ? thickness
        : (size[1])
    )
    const sizeZ = (
      axisIndex === 2
        ? thickness
        : (
            axisIndex === 0
              ? size[2]
              : size[2] - 2 * thickness
          )
    )
    const wallSize = [sizeX, sizeY, sizeZ]
    const topWallSize = [...wallSize]
    const position = [0, 0, 0]
    position[axisIndex] = (size[axisIndex] - thickness) * side / 2

    /* Side wall positions. */
    const position1 = [...position]
    const position2 = [...position]
    position1[2 - axisIndex] += (wallSize[2 - axisIndex] + doorSize[0]) / 4
    position2[2 - axisIndex] -= (wallSize[2 - axisIndex] + doorSize[0]) / 4
    wallSize[2 - axisIndex] = (wallSize[2 - axisIndex] - doorSize[0]) / 2

    /* Top wall position. */
    const position3 = [...position]
    position3[1] += doorSize[1] / 2
    topWallSize[1] -= doorSize[1]
    topWallSize[2 - axisIndex] = doorSize[0]

    if (wallSize.every(x => x > 0) && topWallSize.every(x => x > 0)) {
      return [
        box({
          position: position1,
          size: wallSize
        }),
        box({
          position: position2,
          size: wallSize
        }),
        box({
          position: position3,
          size: topWallSize
        })
      ]
    } else {
      return []
    }
  }
}

function Room ({
  size,
  thickness,
  frontDoorSize,
  leftDoorSize,
  rightDoorSize,
  backDoorSize,
  ...rest
}) {
  thickness = thickness || 0.1
  size = size || [1.0, 1.0, 1.0]
  const [sizeX, sizeY, sizeZ] = size
  const defaultDoorSize = useMemo(() => [0.5, 0.5], [])

  const doorOptions = useMemo(() => (
    [
      [backDoorSize || defaultDoorSize, 2, -1],
      [frontDoorSize || defaultDoorSize, 2, 1],
      [[0, 0], 1, -1],
      [[0, 0], 1, 1],
      [leftDoorSize || defaultDoorSize, 0, -1],
      [rightDoorSize || defaultDoorSize, 0, 1]
    ]
  ), [
    frontDoorSize,
    leftDoorSize,
    rightDoorSize,
    backDoorSize,
    defaultDoorSize
  ])

  const supports = useMemo(() => (
    doorOptions.flatMap(([doorSize, axisIndex, side]) =>
      makeWallSupports({
        thickness,
        axisIndex,
        size: [sizeX, sizeY, sizeZ],
        side,
        doorSize
      })
    )
  ), [sizeX, sizeY, sizeZ, thickness, doorOptions])
  return (
    <>
      {supports.map((support, i) => (
        <Brush key={i} support={support} {...rest} />
      ))}
    </>
  )
}

function Inspector ({
  selection,
  data,
  onChange
}) {
  const defaultValue = [0.5, 0.5]
  return (
    <Box>
      <Vector2Property
        label='Left door size'
        prop='leftDoorSize'
        selection={selection}
        data={data}
        onChange={onChange}
        defaultValue={defaultValue}
      />
      <Vector2Property
        label='Right door size'
        prop='rightDoorSize'
        selection={selection}
        data={data}
        onChange={onChange}
        defaultValue={defaultValue}
      />
      <Vector2Property
        label='Front door size'
        prop='frontDoorSize'
        selection={selection}
        data={data}
        onChange={onChange}
        defaultValue={defaultValue}
      />
      <Vector2Property
        label='Back door size'
        prop='backDoorSize'
        selection={selection}
        data={data}
        onChange={onChange}
        defaultValue={defaultValue}
      />
    </Box>
  )
}

const inspector = {
  key: 'room',
  displayName: 'Room',
  component: Inspector
}

const component = {
  key: 'room',
  displayName: 'Room',
  inspectors: [...mixins.brush, boxSize, inspector],
  component: Room
}

export default component
