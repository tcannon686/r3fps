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
import Button from '@material-ui/core/Button'
import CssBaseline from '@material-ui/core/CssBaseline'
import Drawer from '@material-ui/core/Drawer'
import Snackbar from '@material-ui/core/Snackbar'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Toolbar from '@material-ui/core/Toolbar'
import Tooltip from '@material-ui/core/Tooltip'

/* Material UI icons. */
import PlayArrowIcon from '@material-ui/icons/PlayArrow'
import StopIcon from '@material-ui/icons/Stop'
import AddIcon from '@material-ui/icons/Add'
import CloudDownloadIcon from '@material-ui/icons/CloudDownload'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'

import { makeStyles } from '@material-ui/core/styles'

/* Editor components. */
import Inspector from './Inspector'
import Palette from './Palette'
import TabPanel from './TabPanel'
import ThreeView from './ThreeView'

/* Game. */
import { Game, scene, object } from '../game'
import components from '../game/components'

/* Hooks. */
import { useUndoable, useKeyboardShortcut } from '../hooks'

/* Utils. */
import { download, upload } from '../utils'

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

function EditorSidebar ({
  data,
  selection,
  camera,
  onChange,
  onPlay,
  onStop,
  isPlaying
}) {
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

  const handleDownload = () => {
    download('scene.json', JSON.stringify(data))
  }

  const handleUpload = () => {
    upload()
      .then(data => JSON.parse(data))
      .then(data => onChange(data))
  }

  const handleNew = () => {
    onChange(scene({}))
  }

  return (
    <Drawer variant='persistent' className={classes.drawer} open>
      <div className={classes.drawerContent}>
        <Toolbar>
          <Tooltip title='New'>
            <Button onClick={handleNew}>
              <AddIcon />
            </Button>
          </Tooltip>
          <Tooltip title='Upload'>
            <Button onClick={handleUpload}>
              <CloudUploadIcon />
            </Button>
          </Tooltip>
          <Tooltip title='Download' onClick={handleDownload}>
            <Button>
              <CloudDownloadIcon />
            </Button>
          </Tooltip>
          <Tooltip title={isPlaying ? 'Stop' : 'Play'}>
            <Button onClick={isPlaying ? onStop : onPlay}>
              {isPlaying
                ? (<StopIcon />)
                : (<PlayArrowIcon />)}
            </Button>
          </Tooltip>
        </Toolbar>
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

export function Editor (props) {
  const [data, pushData, undo, redo, setData] = useUndoable(() => scene({}))
  const [selection, setSelection] = useState(new Set())
  const [clipboardData, setClipboardData] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

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

  /* When the user clicks the play button. */
  const handlePlay = () => {
    const playerSpawn = data.objects.find(x => x.type === 'playerSpawn')
    if (playerSpawn) {
      setIsPlaying(true)
    } else {
      setErrorMessage('You need to place a spawnpoint first!')
    }
  }

  const selectedObjects = data.objects.filter(x => selection.has(x.id))
  const copy = () => {
    setClipboardData(selectedObjects)
  }
  const paste = () => {
    const objects = [
      ...data.objects,
      ...clipboardData.map(object)
    ]
    pushData({
      ...data,
      objects
    })
  }

  useKeyboardShortcut(['Control', 'Z'], undo)
  useKeyboardShortcut(['Control', 'Shift', 'Z'], redo)
  useKeyboardShortcut(['Control', 'C'], copy)
  useKeyboardShortcut(['Control', 'V'], paste)

  return (
    <div className={classes.root}>
      <CssBaseline />
      <EditorSidebar
        data={data}
        selection={selection}
        onChange={handleEdit}
        camera={cameraRef}
        isPlaying={isPlaying}
        onPlay={handlePlay}
        onStop={() => { setIsPlaying(false) }}
      />
      <main className={classes.content}>
        {isPlaying
          ? (
            <Game data={data} />
            )
          : (
            <ThreeView
              cameraRef={cameraRef}
              data={data}
              selection={selection}
              onSelectionChange={setSelection}
              onChange={handleChange}
              onEdit={handleEdit}
            />
            )}
        <Snackbar
          open={!!errorMessage}
          onClose={() => { setErrorMessage(null) }}
          message={errorMessage}
        />
      </main>
    </div>
  )
}
