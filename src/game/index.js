import { v4 as uuid } from 'uuid'
import { Canvas } from 'react-three-fiber'
import components from './components'
import {
  PhysicsScene
} from '../physics'
import Player from './Player'

const nextId = () => {
  return uuid()
}

/**
 * Create an empty game scene.
 */
export function scene () {
  return {
    objects: []
  }
}

/**
 * Create an object with the specified type and properties.
 */
export function object ({ type, props }) {
  return {
    type,
    props,
    id: nextId()
  }
}

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
