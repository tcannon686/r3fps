import Box from '@material-ui/core/Box'

import NumberProperty from './NumberProperty'
import BooleanProperty from './BooleanProperty'

const roundBrush = {
  key: 'roundBrush',
  displayName: 'Round brush',
  component ({
    selection,
    data,
    onChange
  }) {
    return (
      <Box>
        <NumberProperty
          prop='roundRadius'
          selection={selection}
          data={data}
          onChange={onChange}
          defaultValue={0.0}
          label='Round radius'
        />
        <BooleanProperty
          prop='flatTop'
          selection={selection}
          data={data}
          onChange={onChange}
          defaultValue={false}
          label='Flat top'
        />
        <BooleanProperty
          prop='flatBottom'
          selection={selection}
          data={data}
          onChange={onChange}
          defaultValue={false}
          label='Flat bottom'
        />
      </Box>
    )
  }
}

export default roundBrush
