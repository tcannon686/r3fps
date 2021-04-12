/* React. */
import {
  useCallback,
  useState,
  useMemo
} from 'react'

/* react-three-fiber. */
import { Canvas } from 'react-three-fiber'

/* three.js */
import {
  Vector3
} from 'three'

/* Editor components. */
import TranslateArrows from './TranslateArrows'
import Camera from './Camera'
import SelectionRenderer from './SelectionRenderer'

/* Physics. */
import {
  PhysicsScene
} from '../physics'

/* Game components. */
import components from '../game/components'

/* Utils. */
import { useEventListener } from '../hooks'

export default function ThreeView ({
  data,
  selection,
  onSelectionChange,
  onChange,
  onEdit,
  cameraRef
}) {
  const [cameraMode, setCameraMode] = useState()

  /* Camera controls. */
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

  /* Selection. */
  const handleObjectSelected = useCallback((id) => {
    const newSelection = new Set(selection)
    if (newSelection.has(id)) {
      newSelection.delete(id)
    } else {
      newSelection.add(id)
    }
    onSelectionChange(newSelection)
  }, [selection, onSelectionChange])

  const handlePointerMissed = useCallback(() => {
    onSelectionChange(new Set())
  }, [onSelectionChange])

  /* Movement. */
  const moveSelection = useCallback((amount) => {
    const newData = {
      ...data,
      objects: data.objects.map(x => {
        if (selection.has(x.id)) {
          /* If the object is selected, modify it. */
          const position = (
            x.props.position
              ? [
                  x.props.position[0] + amount.x,
                  x.props.position[1] + amount.y,
                  x.props.position[2] + amount.z
                ]
              : [amount.x, amount.y, amount.z]
          )

          /* Clone the object. */
          return {
            ...x,
            props: {
              ...x.props,
              position
            }
          }
        } else {
          /* Otherwise just return the object. */
          return x
        }
      })
    }
    return newData
  }, [data, selection])

  /* Dragging. */
  const [isDragging, setIsDragging] = useState(false)
  const handleBeginDrag = useCallback(() => {
    setIsDragging(true)
  }, [setIsDragging])

  const handleDrag = useCallback((amount) => {
    onChange(moveSelection(amount))
  }, [moveSelection, onChange])

  const handleEndDrag = useCallback(() => {
    onEdit(data)
    setIsDragging(false)
  }, [data, onEdit, setIsDragging])

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

  /* Keyboard shortcuts. */
  useEventListener('keyup', (e) => {
    /* Handle delete. */
    if (e.key === 'Delete') {
      if (e.target === document.body) {
        onChange({
          ...data,
          objects: data.objects.filter(x => !selection.has(x.id))
        })
        onSelectionChange(new Set())
      }
    }
  })

  /* Create the components in the scene. */
  const gameComponents = data.objects.map((x, i) => {
    const Component = components[x.type].component
    return (
      <group
        key={x.id}
        userData={x}
        onPointerUp={(e) => {
          e.stopPropagation()
          if (!isDragging && cameraMode !== 'fps') {
            handleObjectSelected(x.id)
          }
        }}
      >
        <Component
          {...x.props}
          inEditor
        />
      </group>
    )
  })

  return (
    <Canvas
      onMouseDown={handleMouseDown}
      onContextMenu={handleContextMenu}
      onPointerMissed={handlePointerMissed}
    >
      <PhysicsScene>
        <Camera
          position={[0, 0, 2]}
          mode={cameraMode}
          ref={cameraRef}
        />
        {gameComponents}
        <TranslateArrows
          onDrag={handleDrag}
          onBeginDrag={handleBeginDrag}
          onEndDrag={handleEndDrag}
          position={[origin.x, origin.y, origin.z]}
        />
      </PhysicsScene>
      <SelectionRenderer selection={selection} />
    </Canvas>
  )
}
