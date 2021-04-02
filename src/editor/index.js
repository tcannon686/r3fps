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

let globalId = 0
const nextId = () => {
  return ++globalId
}

function createObject (type, props) {
  return {
    type,
    props,
    id: nextId()
  }
}

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
    const position = [
      cameraPosition.x + forward.x * 4,
      cameraPosition.y + forward.y * 4,
      cameraPosition.z + forward.z * 4
    ]

    onChange({
      ...data,
      objects: [
        ...data.objects,
        createObject(
          type,
          { kinematic: true, position }
        )
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

export function Editor ({ data, onChange }) {
  const [selection, setSelection] = useState(new Set())

  const classes = useStyles()
  const cameraRef = useRef()

  return (
    <div className={classes.root}>
      <CssBaseline />
      <EditorSidebar
        data={data}
        selection={selection}
        onChange={onChange}
        camera={cameraRef}
      />
      <main className={classes.content}>
        <ThreeView
          cameraRef={cameraRef}
          data={data}
          selection={selection}
          onSelectionChange={setSelection}
          onChange={(newData) => {
            onChange(newData)
          }}
        />
      </main>
    </div>
  )
}
