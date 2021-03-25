import {
  useMemo,
  useState,
  useEffect
} from 'react'

/* Material UI components. */
import Box from '@material-ui/core/Box'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'

import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  evenlySpaced: {
    '& > *': {
      margin: theme.spacing(1)
    }
  }
}))

export default function BooleanProperty ({
  selection,
  data,
  onChange,
  prop,
  defaultValue,
  label
}) {
  const classes = useStyles()

  const origin = useMemo(() => {
    let origin = defaultValue
    data.objects.forEach(x => {
      if (selection.has(x.id)) {
        if (x.props[prop]) {
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
    const value = e.target.checked
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
    <Box className={classes.evenlySpaced}>
      <FormControlLabel
        control={
          <Checkbox
            variant='filled'
            checked={value}
            onChange={handleChange}
          />
        }
        label={label}
      />
    </Box>
  )
}
