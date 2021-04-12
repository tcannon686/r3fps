import VectorProperty from './VectorProperty'

function BoxSize ({
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

const boxSize = {
  key: 'boxSize',
  displayName: 'Size',
  component: BoxSize
}

export default boxSize
