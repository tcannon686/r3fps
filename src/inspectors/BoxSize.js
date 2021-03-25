import VectorProperty from './VectorProperty'

export default function BoxSize ({
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
