import Box from '@material-ui/core/Box'
import NumberProperty from './NumberProperty'

export default function CylinderSize ({
  selection,
  data,
  onChange
}) {
  return (
    <Box>
      <NumberProperty
        prop='r1'
        selection={selection}
        data={data}
        onChange={onChange}
        defaultValue={0.5}
        label='Radius 1'
      />
      <NumberProperty
        prop='r2'
        selection={selection}
        data={data}
        onChange={onChange}
        defaultValue={0.5}
        label='Radius 2'
      />
      <NumberProperty
        prop='height'
        selection={selection}
        data={data}
        onChange={onChange}
        defaultValue={1.0}
        label='Height'
      />
    </Box>
  )
}
