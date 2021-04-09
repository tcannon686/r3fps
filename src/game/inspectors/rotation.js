import VectorProperty from './VectorProperty'

const rotation = {
  key: 'rotation',
  displayName: 'Rotation',
  component ({
    selection,
    data,
    onChange
  }) {
    return (
      <VectorProperty
        prop='rotation'
        selection={selection}
        data={data}
        onChange={onChange}
        defaultValue={[0, 0, 0]}
      />
    )
  }
}

export default rotation
