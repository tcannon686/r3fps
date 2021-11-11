import Box from '@material-ui/core/Box'

import BooleanProperty from './BooleanProperty'

function Body ({
  selection,
  data,
  onChange
}) {
  return (
    <Box>
      <BooleanProperty
        prop='kinematic'
        selection={selection}
        data={data}
        onChange={onChange}
        label='Kinematic'
        defaultValue
      />
      <BooleanProperty
        prop='enableBody'
        selection={selection}
        data={data}
        onChange={onChange}
        label='Enable'
        defaultValue
      />
    </Box>
  )
}

const body = {
  key: 'body',
  displayName: 'Body',
  component: Body
}

export default body
