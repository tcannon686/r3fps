import VectorProperty from './VectorProperty'

export default function Scale ({
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
