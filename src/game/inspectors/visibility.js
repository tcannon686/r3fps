import BooleanProperty from './BooleanProperty'

function Visibility ({
  selection,
  data,
  onChange
}) {
  return (
    <BooleanProperty
      prop='visible'
      selection={selection}
      data={data}
      onChange={onChange}
      label='Visible'
      defaultValue
    />
  )
}

const visibility = {
  key: 'visibility',
  displayName: 'Visibility',
  component: Visibility
}

export default visibility
