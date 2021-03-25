import BooleanProperty from './BooleanProperty'

export default function Body ({
  selection,
  data,
  onChange
}) {
  return (
    <BooleanProperty
      prop='kinematic'
      selection={selection}
      data={data}
      onChange={onChange}
      defaultValue
      label='Kinematic'
    />
  )
}
