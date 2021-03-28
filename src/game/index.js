import { Canvas } from 'react-three-fiber'
import components from './components'
import {
  PhysicsScene
} from '../physics'
import Player from './Player'

export function Game ({ data }) {
  return (
    <Canvas onClick={e => e.target.requestPointerLock()}>
      <PhysicsScene>
        {data.objects.map((x, i) => {
          const Component = components[x.type].component
          return (
            <Component
              key={x.id}
              {...x.props}
            />
          )
        })}
        <Player position={[0, 0, 0]} />
      </PhysicsScene>
    </Canvas>
  )
}
