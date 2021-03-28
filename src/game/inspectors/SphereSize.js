import NumberProperty from './NumberProperty'

export default function SphereSize ({
  selection,
  data,
  onChange
}) {
  return (
    <NumberProperty
      prop='radius'
      selection={selection}
      data={data}
      onChange={onChange}
      defaultValue={0.5}
      label='Radius'
    />
  )
}
