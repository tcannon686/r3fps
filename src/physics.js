import {
  useEffect,
  useRef,
  useState,
  useContext,
  createContext,
  useMemo
} from 'react'

import { useFrame } from 'react-three-fiber'

import { scene, body } from 'collide'

import { Vector3 } from 'three'
import {
  Float32BufferAttribute
} from 'three'

const PhysicsSceneContext = createContext(scene())

export function PhysicsScene ({ children }) {
  const s = useMemo(() => scene(), [])
  useFrame((state, delta) => {
    s.update(Math.min(delta, 0.1))
  })
  return (
    <PhysicsSceneContext.Provider value={s}>
      {children}
    </PhysicsSceneContext.Provider>
  )
}

export function useBody (optionFactory, dependencies) {
  const b = useMemo(() => body(optionFactory()), dependencies)
  const s = useContext(PhysicsSceneContext)
  const ref = useRef()

  useEffect(() => {
    ref.current.matrixAutoUpdate = false
    const subscription = b.changed.subscribe(() => {
      ref.current.matrix.copy(b.transform)
    })
    s.add(b)
    return () => {
      subscription.unsubscribe()
      s.remove(b)
    }
  }, [b, s, ref])

  return [
    ref,
    b
  ]
}

export function useContacts (body) {
  const [contacts, setContacts] = useState([])
  useEffect(() => {
    const subscription = body.beginOverlap.subscribe((event) => {
      contacts.push(event)
    })
    return () => subscription.unsubscribe()
  }, [body, contacts])
  useEffect(() => {
    const subscription = body.endOverlap.subscribe((event) => {
      setContacts(contacts.filter(x => x.other !== event.other))
    })
    return () => subscription.unsubscribe()
  }, [body, contacts])
  return contacts
}

function randomizeDirection (d) {
  do {
    d.set(
      Math.random() - Math.random(),
      Math.random() - Math.random(),
      Math.random() - Math.random()
    )
  } while (d.lengthSq() === 0)
  d.normalize()
}

/*
 * Basically the expanding polytope algorithm, but with some extra steps.
 */
function fillSupportGeometry (geometry, support, tolerance = 0.01) {
  const triangles = []
  const vertices = []

  const makeTriangle = (ia, ib, ic) => {
    const ac = vertices[ic].clone().sub(vertices[ia])
    const bc = vertices[ic].clone().sub(vertices[ib])
    const normal = ac.cross(bc)

    if (normal.lengthSq() === 0) {
      return null
    }
    normal.normalize()

    const distance = normal.dot(vertices[ic])

    return {
      ia,
      ib,
      ic,
      normal,
      distance
    }
  }

  const edgeCounts = new Map()

  const incEdge = (a, b) => {
    /*
     * Maximum safe integer is 2**53, so we shift by half of 53 to create a key.
     * If a vertex index is greater than 2**26, we got other problems ;).
     */
    const key1 = a + (b * 0x4000000)
    const key2 = b + (a * 0x4000000)
    if (edgeCounts.has(key2)) {
      edgeCounts.set(key2, edgeCounts.get(key2) + 1)
    } else {
      edgeCounts.set(key1, (edgeCounts.get(key1) || 0) + 1)
    }
  }

  /* Create initial triangles. */
  while (vertices.length < 3) {
    const v = new Vector3()
    do {
      randomizeDirection(v)
      support(v)
    } while (vertices.find(x => x.equals(v)))
    vertices.push(v)
  }

  {
    const v = new Vector3()
    const t = makeTriangle(0, 2, 1, vertices)
    v.copy(t.normal).negate()
    support(v)
    if (vertices.find(x => x.equals(v))) {
      t.normal.negate()
      const tmp = vertices[0]
      vertices[0] = vertices[2]
      vertices[2] = tmp
      v.copy(t.normal).negate()
      support(v)
    }
    vertices.push(v)
    triangles.push(t)
    triangles.push(makeTriangle(0, 1, 3, vertices))
    triangles.push(makeTriangle(1, 2, 3, vertices))
    triangles.push(makeTriangle(2, 0, 3, vertices))
  }

  let done = false
  while (!done) {
    done = true
    for (const triangle of triangles) {
      edgeCounts.clear()

      const a = new Vector3().copy(triangle.normal)
      support(a)

      if (a.dot(triangle.normal) - triangle.distance > tolerance) {
        done = false
        for (let i = 0; i < triangles.length; i++) {
          const t = triangles[i]
          if (a.clone().sub(vertices[t.ia]).dot(t.normal) >= 0) {
            incEdge(t.ia, t.ib)
            incEdge(t.ib, t.ic)
            incEdge(t.ic, t.ia)
            /* Remove the triangle. */
            triangles.splice(i, 1)
            i--
          }
        }

        /* Add the new vertex. */
        vertices.push(a)

        /* Create new faces from non-shared edges. */
        for (const key of edgeCounts.keys()) {
          if (edgeCounts.get(key) === 1) {
            const e0 = key & 0x3ffffff
            const e1 = Math.floor(key / 0x4000000)
            const tri = (
              makeTriangle(
                e0,
                e1,
                vertices.length - 1,
                vertices
              )
            )
            triangles.push(tri)
          }
        }
      }
    }
  }

  const vertexData = new Float32Array(vertices.flatMap(x => [x.x, x.y, x.z]))
  const indexData = triangles.flatMap(t => [t.ia, t.ib, t.ic])
  geometry.setAttribute('position', new Float32BufferAttribute(vertexData, 3))
  geometry.setIndex(indexData)
  geometry.computeVertexNormals()
  geometry.computeBoundingSphere()
}

export function SupportGeometry ({ support }) {
  const ref = useRef()
  useEffect(() => {
    fillSupportGeometry(ref.current, support)
  })
  return (
    <bufferGeometry ref={ref} />
  )
}
