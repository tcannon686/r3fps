import VectorProperty from './VectorProperty'

export default function Rotation ({
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
