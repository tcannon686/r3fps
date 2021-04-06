/* React. */
import {
  useRef,
  useState
} from 'react'

/* three.js */
import {
  Vector3
} from 'three'

/* Material UI components. */
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Drawer from '@material-ui/core/Drawer'
import CssBaseline from '@material-ui/core/CssBaseline'

import { makeStyles } from '@material-ui/core/styles'

/* Editor components. */
import Inspector from './Inspector'
import Palette from './Palette'
import TabPanel from './TabPanel'
import ThreeView from './ThreeView'

/* Game. */
import { scene, object } from '../game'
import components from '../game/components'

/* Hooks */
import { useUndoable, useKeyboardShortcut } from '../hooks'

const drawerWidth = 320
const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerContent: {
    width: drawerWidth,
    overflowX: 'hidden'
  },
  content: {
    flexGrow: 1,
    position: 'absolute',
    left: drawerWidth,
    top: 0,
    right: 0,
    bottom: 0
  }
}))

function EditorSidebar ({ data, onChange, selection, camera }) {
  const classes = useStyles()
  const [tab, setTab] = useState(0)

  const addObject = (type) => {
    /* Calculate camera direction. */
    const right = new Vector3()
    const up = new Vector3()
    const forward = new Vector3()
    const cameraPosition = new Vector3()
    camera.current.matrixWorld.extractBasis(right, up, forward)
    camera.current.getWorldPosition(cameraPosition)
    forward.negate()

    /* Create the object in front of the camera. */
    const distance = (components[type].distance || 2.0)
    const position = [
      cameraPosition.x + forward.x * distance,
      cameraPosition.y + forward.y * distance,
      cameraPosition.z + forward.z * distance
    ]

    onChange({
      ...data,
      objects: [
        ...data.objects,
        object({
          type,
          props: { kinematic: true, position }
        })
      ]
    })
  }

  return (
    <Drawer variant='persistent' className={classes.drawer} open>
      <div className={classes.drawerContent}>
        <Tabs
          onChange={(e, value) => setTab(value)}
          value={tab}
          variant='fullWidth'
        >
          <Tab label='Palette' />
          <Tab label='Properties' />
        </Tabs>
        <TabPanel value={tab} index={0}>
          <Palette onSelect={addObject} />
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <Inspector data={data} selection={selection} onChange={onChange} />
        </TabPanel>
      </div>
    </Drawer>
  )
}

export function Editor () {
  const [data, pushData, undo, redo, setData] = useUndoable(() => scene({}))
  const [selection, setSelection] = useState(new Set())

  const classes = useStyles()
  const cameraRef = useRef()

  /* When the data is changed, updated it, but not update the undo history. */
  const handleChange = (newData) => {
    setData(newData)
  }

  /* When an edit is made, update the undo history. */
  const handleEdit = (newData) => {
    pushData(newData)
  }

  useKeyboardShortcut(['Control', 'Z'], undo)
  useKeyboardShortcut(['Control', 'Shift', 'Z'], redo)

  return (
    <div className={classes.root}>
      <CssBaseline />
      <EditorSidebar
        data={data}
        selection={selection}
        onChange={handleEdit}
        camera={cameraRef}
      />
      <main className={classes.content}>
        <ThreeView
          cameraRef={cameraRef}
          data={data}
          selection={selection}
          onSelectionChange={setSelection}
          onChange={handleChange}
          onEdit={handleEdit}
        />
      </main>
    </div>
  )
}
