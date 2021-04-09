import NumberProperty from './NumberProperty'

const sphereSize = {
  key: 'sphereSize',
  displayName: 'Size',
  component ({
    selection,
    data,
    onChange
  }) {
    return (
      <NumberProperty
        prop='radius'
        selection={selection}
        data={data}
        onChange={onChange}
        defaultValue={0.5}
        label='Radius'
      />
    )
  }
}

export default sphereSize
