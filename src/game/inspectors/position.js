import Vector3Property from './Vector3Property'

function Position ({
  selection,
  data,
  onChange
}) {
  return (
    <Vector3Property
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
