import * as mixins from '../inspectors/mixins'

const component = {
  key: 'directionalLight',
  displayName: 'Directional Light',
  inspectors: [...mixins.light],
  component ({ position, color, ...rest }) {
    color = color || '#ffffff'
    position = position || [0, 0, 0]
    return (
      <group position={position}>
        <mesh>
          <meshBasicMaterial color={color} />
          <sphereGeometry args={[0.25, 16, 8]} />
        </mesh>
        <directionalLight color={color} {...rest} />
      </group>
    )
  }
}

export default component
