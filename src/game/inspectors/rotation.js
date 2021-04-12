import VectorProperty from './VectorProperty'

function Rotation ({
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

const rotation = {
  key: 'rotation',
  displayName: 'Rotation',
  component: Rotation
}

export default rotation
