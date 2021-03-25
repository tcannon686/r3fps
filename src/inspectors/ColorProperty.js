
import {
  useMemo,
  useState,
  useEffect
} from 'react'

export default function ColorProperty ({
  selection,
  data,
  onChange,
  prop,
  defaultValue
}) {
  const origin = useMemo(() => {
    let origin = defaultValue
    data.objects.forEach(x => {
      if (selection.has(x.id)) {
        if (x.props[prop] !== undefined) {
          origin = x.props[prop]
        }
      }
    })
    return origin
  }, [selection, data, prop, defaultValue])

  const [value, setValue] = useState(defaultValue)
  useEffect(() => {
    setValue(origin)
  }, [origin])

  const handleChange = (e) => {
    const value = e.target.value
    setValue(value)

    const newData = {
      ...data,
      objects: data.objects.map(object => {
        if (selection.has(object.id)) {
          return {
            ...object,
            props: {
              ...object.props,
              [prop]: value
            }
          }
        } else {
          return object
        }
      })
    }
    onChange(newData)
  }

  return (
    <input type='color' value={value} onChange={handleChange} />
  )
}
