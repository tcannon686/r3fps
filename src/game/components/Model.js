import { Suspense, Component, forwardRef, useState, useEffect } from 'react'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { useLoader } from 'react-three-fiber'
import { getBaseUrl } from '../../utils'

class ErrorBoundary extends Component {
  constructor (props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError (error) {
    console.error(error)
    return { hasError: true }
  }

  render () {
    if (this.state.hasError) {
      return null
    } else {
      return this.props.children
    }
  }
}

const ObjModel = forwardRef(({ url, ...rest }, ref) => {
  const scene = useLoader(OBJLoader, url)
  return (
    <primitive ref={ref} object={scene} {...rest} />
  )
})

const GltfModel = forwardRef(({ url, ...rest }, ref) => {
  const { scene } = useLoader(GLTFLoader, url)
  return (
    <primitive ref={ref} object={scene} {...rest} />
  )
})

const Model = forwardRef(({ url, ...rest }, ref) => {
  const [errorBoundaryKey, setErrorBoundaryKey] = useState(0)
  const path = new URL(url, getBaseUrl()).pathname
  let model = null

  useEffect(() => {
    setErrorBoundaryKey(key => key + 1)
  }, [url])

  if (path.match(/\.glb$|\.gltf$/)) {
    model = (
      <GltfModel ref={ref} url={url} {...rest} />
    )
  } else if (path.match(/\.obj$/)) {
    model = (
      <ObjModel ref={ref} url={url} {...rest} />
    )
  } else {
    return null
  }

  return (
    <ErrorBoundary key={errorBoundaryKey}>
      <Suspense fallback={null}>
        {model}
      </Suspense>
    </ErrorBoundary>
  )
})

export default Model
