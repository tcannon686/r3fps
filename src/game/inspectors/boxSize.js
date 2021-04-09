import VectorProperty from './VectorProperty'

const boxSize = {
  key: 'boxSize',
  displayName: 'Size',
  component ({
    selection,
    data,
    onChange
  }) {
    return (
      <VectorProperty
        prop='size'
        selection={selection}
        data={data}
        onChange={onChange}
        defaultValue={[1, 1, 1]}
      />
    )
  }
}

export default boxSize
