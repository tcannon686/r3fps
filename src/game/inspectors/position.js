import VectorProperty from './VectorProperty'

function Position ({
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

const position = {
  key: 'position',
  displayName: 'Position',
  component: Position
}

export default position
