import ColorProperty from './ColorProperty'

const color = {
  key: 'color',
  displayName: 'Color',
  component ({
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
}

export default color
