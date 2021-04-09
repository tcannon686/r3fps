import VectorProperty from './VectorProperty'

const scale = {
  key: 'scale',
  displayName: 'Scale',
  component ({
    selection,
    data,
    onChange
  }) {
    return (
      <VectorProperty
        prop='scale'
        selection={selection}
        data={data}
        onChange={onChange}
        defaultValue={[1, 1, 1]}
      />
    )
  }
}

export default scale
