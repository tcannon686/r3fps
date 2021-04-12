import BooleanProperty from './BooleanProperty'

function Body ({
  selection,
  data,
  onChange
}) {
  return (
    <BooleanProperty
      prop='kinematic'
      selection={selection}
      data={data}
      onChange={onChange}
      defaultValue
      label='Kinematic'
    />
  )
}

const body = {
  key: 'body',
  displayName: 'Body',
  component: Body
}

export default body
