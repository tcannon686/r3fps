import {
  useMemo,
  useState,
  useEffect
} from 'react'

/* Material UI components. */
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  evenlySpaced: {
    '& > *': {
      margin: theme.spacing(1)
    }
  }
}))

export default function NumberProperty ({
  selection,
  data,
  onChange,
  prop,
  defaultValue,
  label
}) {
  const classes = useStyles()

  const origin = useMemo(() => {
    let origin = 0
    data.objects.forEach(x => {
      if (selection.has(x.id)) {
        if (x.props[prop] !== undefined) {
          origin += x.props[prop]
        } else {
          origin += defaultValue
        }
      }
    })
    origin *= 1 / selection.size
    return origin
  }, [selection, data, prop, defaultValue])

  const [pos, setPos] = useState(defaultValue)
  useEffect(() => {
    setPos(origin)
  }, [origin])

  const handleBlur = () => {
    if (isNaN(pos)) {
      setPos(origin)
      return
    }
    const newData = {
      ...data,
      objects: data.objects.map(object => {
        if (selection.has(object.id)) {
          let position = (
            object.props[prop] !== undefined
              ? object.props[prop]
              : defaultValue
          )
          position += pos - origin
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
    <Box className={classes.evenlySpaced}>
      <TextField
        fullWidth
        label={label}
        variant='filled'
        value={pos}
        onChange={(e) => setPos(e.target.value)}
        onBlur={handleBlur}
      />
    </Box>
  )
}
