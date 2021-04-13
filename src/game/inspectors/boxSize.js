import Vector3Property from './Vector3Property'

function BoxSize ({
  selection,
  data,
  onChange
}) {
  return (
    <Vector3Property
      prop='size'
      selection={selection}
      data={data}
      onChange={onChange}
      defaultValue={[1, 1, 1]}
    />
  )
}

const boxSize = {
  key: 'boxSize',
  displayName: 'Size',
  component: BoxSize
}

export default boxSize
