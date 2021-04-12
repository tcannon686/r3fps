import NumberProperty from './NumberProperty'

function SphereSize ({
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

const sphereSize = {
  key: 'sphereSize',
  displayName: 'Size',
  component: SphereSize
}

export default sphereSize
