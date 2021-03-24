import {
  useMemo,
  useState,
  useEffect
} from 'react'

/* Material UI components. */
import Box from '@material-ui/core/Box'
import TextField from '@material-ui/core/TextField'

import { makeStyles } from '@material-ui/core/styles'

import {
  Vector3,
} from 'three'

const useStyles = makeStyles((theme) => ({
  evenlySpaced: {
    '& > *': {
      margin: theme.spacing(1)
    }
  }
}))

export default function Position ({
  selection,
  data,
  onChange
}) {
  const classes = useStyles()

  const origin = useMemo(() => {
    const origin = new Vector3()
    const pos = new Vector3()
    data.objects.forEach(x => {
      if (selection.has(x.id)) {
        if (x.props.position) {
          pos.set(...x.props.position)
        } else {
          pos.set(0, 0, 0)
        }
        origin.add(pos)
      }
    })
    origin.multiplyScalar(1 / selection.size)
    return [origin.x, origin.y, origin.z]
  }, [selection, data])

  const [pos, setPos] = useState([0, 0, 0])
  const [ox, oy, oz] = origin
  useEffect(() => {
    setPos([ox, oy, oz].map(v => Math.round(v * 1000) / 1000))
  }, [ox, oy, oz])

  const setComponent = (i, v) => {
    const newPos = [...pos]
    newPos[i] = v
    setPos(newPos)
  }

  const handleBlur = () => {
    const newData = {
      ...data,
      objects: data.objects.map(object => {
        if (selection.has(object.id)) {
          const position = object.props.position || [0, 0, 0]
          for (let i = 0; i < position.length; i ++) {
            position[i] += pos[i] - origin[i]
          }
          return {
            ...object,
            props: {
              ...object.props,
              position
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
    <Box class={classes.evenlySpaced}>
      {['x', 'y', 'z'].map((x, i) => (
        <TextField
          key={x}
          fullWidth
          label={x.toUpperCase()}
          variant='filled'
          value={pos[i]}
          onChange={(e) => setComponent(i, e.target.value)}
          onBlur={handleBlur}
        />
      ))}
    </Box>
  )
}
