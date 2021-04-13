import {
  useMemo,
  useState,
  useEffect
} from 'react'

/* Material UI components. */
import Grid from '@material-ui/core/Grid'
import TextField from '@material-ui/core/TextField'

import {
  Vector2
} from 'three'

export default function Vector2Property ({
  selection,
  data,
  onChange,
  prop,
  label,
  defaultValue
}) {
  const origin = useMemo(() => {
    const origin = new Vector2()
    const pos = new Vector2()
    data.objects.forEach(x => {
      if (selection.has(x.id)) {
        if (x.props[prop]) {
          pos.set(...x.props[prop])
        } else {
          pos.set(...defaultValue)
        }
        origin.add(pos)
      }
    })
    origin.multiplyScalar(1 / selection.size)
    return [origin.x, origin.y]
  }, [selection, data, prop, defaultValue])

  const [pos, setPos] = useState(defaultValue)
  const [ox, oy] = origin
  useEffect(() => {
    setPos([ox, oy].map(v => Math.round(v * 1000) / 1000))
  }, [ox, oy])

  const setComponent = (i, v) => {
    const newPos = [...pos]
    newPos[i] = v
    setPos(newPos)
  }

  const handleBlur = () => {
    if (pos.some(x => isNaN(x))) {
      setPos(origin)
      return
    }
    const newData = {
      ...data,
      objects: data.objects.map(object => {
        if (selection.has(object.id)) {
          const position = [...(object.props[prop] || defaultValue)]
          for (let i = 0; i < position.length; i++) {
            position[i] += pos[i] - origin[i]
          }
          return {
            ...object,
            props: {
              ...object.props,
              [prop]: position
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
    <Grid container spacing={1}>
      {['x', 'y'].map((x, i) => (
        <Grid item key={x} xs={6}>
          <TextField
            label={(label ? label + ' ' : '') + x.toUpperCase()}
            variant='filled'
            value={pos[i]}
            onChange={(e) => setComponent(i, e.target.value)}
            onBlur={handleBlur}
          />
        </Grid>
      ))}
    </Grid>
  )
}
