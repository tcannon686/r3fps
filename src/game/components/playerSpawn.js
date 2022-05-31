import { useMemo } from 'react'
import { circle, hull } from 'tcollide'
import position from '../inspectors/position'
import rotation from '../inspectors/rotation'
import { useSupportGeometry } from '../../physics'

/* Utils. */
import { useArrowGeometry } from '../../hooks'

function PlayerSpawnPreview ({ color, position, rotation }) {
  const arrowGeometry = useArrowGeometry()
  const support = useMemo(() => (
    hull(
      circle({ position: [0, 0.25, 0], radius: 0.25 }),
      circle({ position: [0, -1.25, 0], radius: 0.25 })
    )
  ), [])
  const geometry = useSupportGeometry(support)
  return (
    <group position={position} rotation={rotation.map(x => x * Math.PI / 180)}>
      <mesh geometry={geometry}>
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh geometry={arrowGeometry} rotation={[-Math.PI / 2, 0, 0]}>
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  )
}

function PlayerSpawn ({ position, rotation, inEditor, ...rest }) {
  if (inEditor) {
    position = position || [0, 0, 0]
    rotation = rotation || [0, 0, 0]
    return (
      <PlayerSpawnPreview
        position={position}
        rotation={rotation}
        color='#0000ff'
      />
    )
  } else {
    return null
  }
}
const component = {
  key: 'playerSpawn',
  displayName: 'Player Spawnpoint',
  inspectors: [position, rotation],
  component: PlayerSpawn
}

export default component
