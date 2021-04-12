/* React. */
import { useMemo } from 'react'

/* Material UI components. */
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Tooltip from '@material-ui/core/Tooltip'

/* react-three-fiber. */
import { Canvas } from 'react-three-fiber'

/* Physics. */
import {
  DisablePhysics
} from '../physics'

/* Game components. */
import components from '../game/components'

function PaletteItem ({ onClick, text, component, distance }) {
  const Component = component
  const d = (1 / Math.sqrt(3)) * distance
  return (
    <Grid item xs={4}>
      <Tooltip title={`Add ${text}`}>
        <Button onClick={onClick}>
          <div
            style={{
              position: 'relative',
              width: '1.0in',
              height: '1.0in',
              overflow: 'hidden'
            }}
          >
            <Canvas
              camera={{ position: [d, d, d] }}
              invalidateFrameloop
            >
              <DisablePhysics>
                <directionalLight position={[1, 3, 2]} />
                <ambientLight />
                <Component inEditor />
              </DisablePhysics>
            </Canvas>
          </div>
        </Button>
      </Tooltip>
    </Grid>
  )
}

export default function Palette ({ onSelect }) {
  const paletteItems = useMemo(() => {
    const ret = []
    for (const type in components) {
      ret.push(
        <PaletteItem
          key={type}
          onClick={() => onSelect(type)}
          text={components[type].displayName}
          component={components[type].component}
          distance={components[type].distance || 2}
        />
      )
    }
    return ret
  }, [onSelect])
  return (
    <Grid container>
      {paletteItems}
    </Grid>
  )
}
