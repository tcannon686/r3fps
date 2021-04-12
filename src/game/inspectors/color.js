import ColorProperty from './ColorProperty'

function Color ({
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

const color = {
  key: 'color',
  displayName: 'Color',
  component: Color
}

export default color
