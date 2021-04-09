import BooleanProperty from './BooleanProperty'

const body = {
  key: 'body',
  component ({
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
}

export default body
