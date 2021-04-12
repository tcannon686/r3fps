import VectorProperty from './VectorProperty'

function Scale ({
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

const scale = {
  key: 'scale',
  displayName: 'Scale',
  component: Scale
}

export default scale
