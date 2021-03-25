import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
  useContext,
  createContext
} from 'react'

import { Canvas, useThree, useFrame } from 'react-three-fiber'

import {
  Vector3,
  MeshMatcapMaterial,
  CustomBlending,
  OneFactor,
  DstAlphaFactor,
  Color,
  TextureLoader,
  Scene
} from 'three'

/* Material UI components. */
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import Grid from '@material-ui/core/Grid'
import Tooltip from '@material-ui/core/Tooltip'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import MuiBox from '@material-ui/core/Box'
import Fade from '@material-ui/core/Fade'
import Drawer from '@material-ui/core/Drawer'
import CssBaseline from '@material-ui/core/CssBaseline'

import { makeStyles, useTheme } from '@material-ui/core/styles'

import ListSection from './ListSection'

import components from './components'
import inspectors from './inspectors'

import { useEventListener, useIsKeyDown } from './hooks'

import {
  DisablePhysics,
  PhysicsScene
} from './physics'

import { makeArrowGeometry } from './utils'

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

export const SelectionContext = createContext({ selection: new Set() })

function EditorCamera ({ position, mode, ...rest }) {
  const camera = useRef()
  const rotationHelper = useRef()
  const { setDefaultCamera } = useThree()
  const speed = 3

  /* Handle mouselook. */
  const handleMouseMove = useCallback((e) => {
    if (mode === 'fps') {
      camera.current.rotation.x -= e.movementY * 0.005
      rotationHelper.current.rotation.y -= e.movementX * 0.005
    }
  }, [mode])
  useEventListener('mousemove', handleMouseMove)

  const keyIsDown = useIsKeyDown()

  useEffect(() => {
    setDefaultCamera(camera.current)
  }, [setDefaultCamera])

  const [x, y, z] = position
  useEffect(() => {
    rotationHelper.current.position.set(x, y, z)
  }, [x, y, z])

  const right = new Vector3()
  const up = new Vector3()
  const forward = new Vector3()

  useFrame((state, dt) => {
    /* Update the camera. */
    camera.current.updateMatrixWorld()
    if (mode === 'fps') {
      camera.current.matrixWorld.extractBasis(right, up, forward)
      forward.negate()
      if (keyIsDown.current.E) {
        rotationHelper.current.position.addScaledVector(up, dt * speed)
      }
      if (keyIsDown.current.Q) {
        rotationHelper.current.position.addScaledVector(up, -dt * speed)
      }
      if (keyIsDown.current.D) {
        rotationHelper.current.position.addScaledVector(right, dt * speed)
      }
      if (keyIsDown.current.A) {
        rotationHelper.current.position.addScaledVector(right, -dt * speed)
      }
      if (keyIsDown.current.W) {
        rotationHelper.current.position.addScaledVector(forward, dt * speed)
      }
      if (keyIsDown.current.S) {
        rotationHelper.current.position.addScaledVector(forward, -dt * speed)
      }
    }
  })

  return (
    <group ref={rotationHelper}>
      <perspectiveCamera ref={camera} />
    </group>
  )
}

function useSelection () {
  return useContext(SelectionContext).selection
}

const arrowGeometry = makeArrowGeometry()
function TranslateArrow ({
  onBeginDrag,
  onEndDrag,
  onDrag,
  color,
  direction,
  ...rest
}) {
  const [isHovering, setIsHovering] = useState()

  const [dx, dy, dz] = direction
  const rotation = [
    Math.atan2(Math.sqrt(dx ** 2 + dz ** 2), dy),
    0,
    Math.atan2(dx, dz)
  ]
  const handlePointerOver = useCallback((...args) => {
    setIsHovering(true)
  }, [setIsHovering])
  const handlePointerLeave = useCallback((...args) => {
    setIsHovering(false)
  }, [setIsHovering])
  const totalAmount = useRef(new Vector3())

  const ref = useRef()

  /* Dragging. */
  const [isDragging, setIsDragging] = useState(false)
  const handlePointerDown = useCallback((e) => {
    e.stopPropagation()
    e.target.setPointerCapture(e.pointerId)
    setIsDragging(true)
    totalAmount.current.set(0, 0, 0)
    if (onBeginDrag) {
      onBeginDrag()
    }
  }, [setIsDragging, onBeginDrag])

  const handlePointerUp = useCallback((e) => {
    e.stopPropagation()
    e.target.releasePointerCapture(e.pointerId)
    setIsDragging(false)
    if (onEndDrag) {
      onEndDrag(totalAmount.current.clone())
    }
  }, [setIsDragging, onEndDrag])

  /* Calculating direction. */
  const { camera, size } = useThree()

  const handlePointerMove = useCallback((e) => {
    const b = new Vector3()
    const v = new Vector3(dx, dy, dz)
    if (isDragging) {
      ref.current.getWorldPosition(b)

      v.add(b)
      v.project(camera)
      b.project(camera)

      v.sub(b)
      const len = Math.sqrt(v.x ** 2 + v.y ** 2)
      v.multiplyScalar(1 / len)
      const dot = (
        2 * v.x * e.movementX / size.width -
        2 * v.y * e.movementY / size.height
      )

      v.multiplyScalar(dot)
      v.add(b)
      v.unproject(camera)
      b.unproject(camera)
      v.sub(b)

      if (onDrag) {
        totalAmount.current.add(v)
        onDrag(v)
      }
    }
  }, [isDragging, onDrag, camera, dx, dy, dz, size])

  return (
    <mesh
      geometry={arrowGeometry}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerOver={handlePointerOver}
      onPointerLeave={handlePointerLeave}
      rotation={rotation}
      ref={ref}
      renderOrder={1000}
      {...rest}
    >
      <meshBasicMaterial
        color={(isHovering || isDragging) ? '#ffbb22' : color}
      />
    </mesh>
  )
}

function TranslateArrows ({
  position,
  onDrag,
  onBeginDrag,
  onEndDrag
}) {
  const directions = [
    [[1, 0, 0], '#ff0000'],
    [[0, 1, 0], '#00ff00'],
    [[0, 0, 1], '#0000ff']
  ]
  const ref = useRef()
  const arrowScene = useMemo(() => new Scene(), [])

  const [isDragging, setIsDragging] = useState(false)
  const handleBeginDrag = useCallback(() => {
    setIsDragging(true)
    if (onBeginDrag) {
      onBeginDrag()
    }
  }, [setIsDragging, onBeginDrag])
  const handleEndDrag = useCallback((amount) => {
    setIsDragging(false)
    if (onEndDrag) {
      onEndDrag(amount)
    }
  }, [setIsDragging, onEndDrag])

  const handleDrag = useCallback((v) => {
    if (onDrag) {
      onDrag(v)
    }
  }, [onDrag])
  const { camera, gl, scene, raycaster } = useThree()

  useEffect(() => {
    /* Disable the raycaster while dragging. */
    if (isDragging) {
      raycaster.layers.disableAll()
    } else {
      raycaster.layers.enableAll()
    }
  }, [raycaster, isDragging])

  const worldPos = new Vector3()
  useFrame(() => {
    ref.current.getWorldPosition(worldPos)
    worldPos.applyMatrix4(camera.matrixWorldInverse)
    const scale = -0.1 * worldPos.z
    ref.current.scale.set(scale, scale, scale)
    gl.clearDepth()
    gl.render(arrowScene, camera)
  }, 2)

  useEffect(() => {
    arrowScene.clear()
    arrowScene.add(ref.current)
  }, [scene, ref, arrowScene])

  const [x, y, z] = position
  useEffect(() => {
    ref.current.position.set(x, y, z)
  }, [x, y, z])

  return (
    <group ref={ref}>
      {directions.map((x, i) => (
        <TranslateArrow
          key={i}
          direction={x[0]}
          color={x[1]}
          onDrag={handleDrag}
          onBeginDrag={handleBeginDrag}
          onEndDrag={handleEndDrag}
        />
      ))}
    </group>
  )
}

function makeSelectionMaterial (color) {
  const mat = new MeshMatcapMaterial({
    blending: CustomBlending,
    blendSrc: OneFactor,
    blendDst: DstAlphaFactor,
    color: new Color().set(color),
    transparent: true
  })
  const textureLoader = new TextureLoader()
  textureLoader.load('/textures/matcap.png', (texture) => {
    mat.matcap = texture
    mat.matcap = texture
  })
  return mat
}

function useSelectionMaterial () {
  const theme = useTheme()
  return useMemo(() => makeSelectionMaterial(
    theme.palette.secondary.main
  ), [theme])
}

function SelectionRenderer () {
  const selectionMaterial = useSelectionMaterial()
  const selection = useSelection()

  useFrame(({ gl, scene, camera }) => {
    gl.autoClear = false
    gl.clear()
    gl.render(scene, camera)
    const originalVisibles = scene.children.map(x => x.visible)
    scene.children.forEach(x => {
      x.visible = selection.has(x.userData.id)
    })
    scene.overrideMaterial = selectionMaterial
    gl.render(scene, camera)
    scene.children.forEach((x, i) => {
      x.visible = originalVisibles[i]
    })
    scene.overrideMaterial = null
  }, 1)
  return null
}

function ThreeView ({ data, onSelectionChange, onChange }) {
  const [cameraMode, setCameraMode] = useState()

  const handleMouseDown = (e) => {
    if (e.buttons === 2) {
      setCameraMode('fps')
    }
  }

  const handleMouseUp = (e) => {
    setCameraMode()
  }
  useEventListener('mouseup', handleMouseUp)

  const handleContextMenu = (e) => {
    e.preventDefault()
  }

  const selectionContext = useContext(SelectionContext)
  const selection = useSelection()

  const handleObjectSelected = useCallback((id) => {
    const newSelection = new Set(selection)
    if (newSelection.has(id)) {
      newSelection.delete(id)
    } else {
      newSelection.add(id)
    }
    onSelectionChange(newSelection)
  }, [selection, onSelectionChange])

  const handleDrag = useCallback((amount) => {
    const newData = {
      ...data,
      objects: data.objects.map(x => {
        if (selection.has(x.id)) {
          return {
            ...x,
            props: {
              ...x.props,
              position: (
                x.props.position
                  ? [
                      x.props.position[0] + amount.x,
                      x.props.position[1] + amount.y,
                      x.props.position[2] + amount.z
                    ]
                  : [amount.x, amount.y, amount.z]
              )
            }
          }
        } else {
          return x
        }
      })
    }
    onChange(newData)
  }, [data, selection, onChange])

  const origin = useMemo(() => {
    const origin = new Vector3(0, 0, 0)
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
    return origin
  }, [data, selection])

  return (
    <Canvas onMouseDown={handleMouseDown} onContextMenu={handleContextMenu}>
      <SelectionContext.Provider value={selectionContext}>
        <PhysicsScene>
          <directionalLight position={[1, 3, 2]} />
          <ambientLight />
          <EditorCamera position={[0, 0, 2]} mode={cameraMode} />

          {data.objects.map((x, i) => {
            const Component = components[x.type].component
            return (
              <group
                key={x.id}
                userData={x}
                onClick={(e) => {
                  e.stopPropagation()
                  handleObjectSelected(x.id)
                }}
              >
                <Component
                  {...x.props}
                  id={x.id}
                />
              </group>
            )
          })}

          <TranslateArrows
            onDrag={handleDrag}
            position={[origin.x, origin.y, origin.z]}
          />
        </PhysicsScene>
        <SelectionRenderer />
      </SelectionContext.Provider>
    </Canvas>
  )
}

function TabPanel (props) {
  const { children, value, index, ...other } = props

  return (
    <Fade
      in={value === index}
      style={{
        display: value === index ? 'block' : 'none'
      }}
    >
      <div
        role='tabpanel'
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        <MuiBox>
          {children}
        </MuiBox>
      </div>
    </Fade>
  )
}

function Inspector ({ data, selection, onChange }) {
  const selectedObjects = data.objects.filter(x => selection.has(x.id))
  const selectedInspectors = selectedObjects.map(
    x => components[x.type].inspectors
  )
  const objectInspectors = selectedObjects.length > 0
    ? selectedInspectors.reduce((a, x) => x.filter(type => a.includes(type)))
    : []
  return (
    <form noValidate>
      <List>
        {objectInspectors.map(type => {
          const Component = inspectors[type].component
          return (
            <ListSection key={type} title={inspectors[type].displayName}>
              <Component
                data={data}
                selection={selection}
                onChange={onChange}
              />
            </ListSection>
          )
        })}
      </List>
    </form>
  )
}

function PaletteItem ({ onClick, text, component }) {
  const Component = component
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
            <Canvas camera={{ position: [1, 1, 1] }} invalidateFrameloop>
              <DisablePhysics>
                <directionalLight position={[1, 3, 2]} />
                <ambientLight />
                <Component />
              </DisablePhysics>
            </Canvas>
          </div>
        </Button>
      </Tooltip>
    </Grid>
  )
}

function Palette ({ onSelect }) {
  const paletteItems = useMemo(() => {
    const ret = []
    for (const type in components) {
      ret.push(
        <PaletteItem
          key={type}
          onClick={() => onSelect(type)}
          text={components[type].displayName}
          component={components[type].component}
        />
      )
    }
    return ret
  }, [onSelect])
  return (
    <List>
      <Grid container>
        {paletteItems}
      </Grid>
    </List>
  )
}

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

function EditorSidebar ({ data, onChange }) {
  const classes = useStyles()
  const [tab, setTab] = useState(0)
  const selection = useSelection()

  const addObject = (type) => {
    onChange({
      ...data,
      objects: [
        ...data.objects,
        createObject(type, { kinematic: true })
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

export default function Editor () {
  const [data, setData] = useState(() => ({
    objects: []
  }))
  const [selection, setSelection] = useState(new Set())
  const selectionContext = {
    selection
  }

  const classes = useStyles()

  return (
    <div className={classes.root}>
      <SelectionContext.Provider value={selectionContext}>
        <CssBaseline />
        <EditorSidebar data={data} onChange={setData} />
        <main className={classes.content}>
          <ThreeView
            data={data}
            onSelectionChange={setSelection}
            onChange={(newData) => {
              setData(newData)
            }}
          />
        </main>
      </SelectionContext.Provider>
    </div>
  )
}
