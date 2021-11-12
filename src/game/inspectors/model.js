import UrlProperty from './UrlProperty'

function Model ({
  selection,
  data,
  onChange
}) {
  return (
    <UrlProperty
      prop='modelUrl'
      selection={selection}
      data={data}
      onChange={onChange}
      defaultValue=''
      label='URL'
    />
  )
}

const model = {
  key: 'model',
  displayName: 'Model',
  component: Model
}

export default model
