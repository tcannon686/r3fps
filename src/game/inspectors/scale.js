import Vector3Property from './Vector3Property'

function Scale ({
  selection,
  data,
  onChange
}) {
  return (
    <Vector3Property
      prop='scale'
      selection={selection}
      data={data}
      onChange={onChange}
      defaultValue={[1, 1, 1]}
    />
  )
}

const scale = {
  key: 'scale',
  displayName: 'Scale',
  component: Scale
}

export default scale
