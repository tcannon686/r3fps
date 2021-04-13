import Vector3Property from './Vector3Property'

function Rotation ({
  selection,
  data,
  onChange
}) {
  return (
    <Vector3Property
      prop='rotation'
      selection={selection}
      data={data}
      onChange={onChange}
      defaultValue={[0, 0, 0]}
    />
  )
}

const rotation = {
  key: 'rotation',
  displayName: 'Rotation',
  component: Rotation
}

export default rotation
