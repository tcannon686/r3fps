import VectorProperty from './VectorProperty'

const position = {
  key: 'position',
  displayName: 'Position',
  component ({
    selection,
    data,
    onChange
  }) {
    return (
      <VectorProperty
        prop='position'
        selection={selection}
        data={data}
        onChange={onChange}
        defaultValue={[0, 0, 0]}
      />
    )
  }
}

export default position
