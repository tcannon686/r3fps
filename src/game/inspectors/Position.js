import VectorProperty from './VectorProperty'

export default function Position ({
  selection,
  data,
  onChange
}) {
  return (
    <VectorProperty
      prop='position'
      selection={selection}
      data={data}
      onChange={onChange}
      defaultValue={[0, 0, 0]}
    />
  )
}
