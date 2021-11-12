import {
  useMemo,
  useState,
  useEffect
} from 'react'

import { getBaseUrl } from '../../utils'

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

function isValidUrl (string) {
  try {
    /* eslint-disable-next-line no-new */
    new URL(string, getBaseUrl())
    return true
  } catch (_) {
    return false
  }
}

export default function UrlProperty ({
  selection,
  data,
  onChange,
  prop,
  defaultValue,
  label
}) {
  const classes = useStyles()

  const origin = useMemo(() => (
    data.objects.find(x => selection.has(x.id)).props[prop] ||
    defaultValue ||
    ''
  ), [selection, data, prop, defaultValue])

  const [value, setValue] = useState(defaultValue)
  useEffect(() => {
    setValue(origin)
  }, [origin])

  const handleBlur = () => {
    if (!isValidUrl(value)) {
      setValue(origin)
      return
    }
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
      <TextField
        fullWidth
        label={label}
        variant='filled'
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleBlur}
      />
    </Box>
  )
}
