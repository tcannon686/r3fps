import ColorProperty from './ColorProperty'

export default function Color ({
  selection,
  data,
  onChange
}) {
  return (
    <ColorProperty
      prop='color'
      selection={selection}
      data={data}
      onChange={onChange}
      defaultValue='#ffffff'
    />
  )
}
