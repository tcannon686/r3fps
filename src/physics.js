import {
  useEffect,
  useRef,
  useState,
  useContext,
  createContext,
  useMemo
} from 'react'

import { useFrame } from 'react-three-fiber'

import { scene, body } from 'tcollide'

import {
  Vector3,
  BufferAttribute,
  BufferGeometry
} from 'three'

const PhysicsSceneContext = createContext(scene({}))

export function DisablePhysics ({ children }) {
  const s = useMemo(() => scene({}), [])
  return (
    <PhysicsSceneContext.Provider value={s}>
      {children}
    </PhysicsSceneContext.Provider>
  )
}

export function PhysicsScene ({ children }) {
  const s = useMemo(() => scene({}), [])
  useFrame((state, delta) => {
    s.update(Math.min(delta, 0.1))
  })
  return (
    <PhysicsSceneContext.Provider value={s}>
      {children}
    </PhysicsSceneContext.Provider>
  )
}

export function useBody (ref, options) {
  const b = useMemo(() => body(options), [options])
  const s = useContext(PhysicsSceneContext)

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

  return b
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

function makeSupportGeometry (support) {
  const geometry = new BufferGeometry()

  const tolerance = 0.01

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

  function splitFaces () {
    const vertexToTriangles = new Map()
    triangles.forEach(t => {
      if (!vertexToTriangles.has(t.ia)) {
        vertexToTriangles.set(t.ia, [])
      }
      if (!vertexToTriangles.has(t.ib)) {
        vertexToTriangles.set(t.ib, [])
      }
      if (!vertexToTriangles.has(t.ic)) {
        vertexToTriangles.set(t.ic, [])
      }
      vertexToTriangles.get(t.ia).push(t)
      vertexToTriangles.get(t.ib).push(t)
      vertexToTriangles.get(t.ic).push(t)
    })
    vertexToTriangles.forEach((triangles, index) => {
      const connected = [[triangles[0]]]
      triangles.forEach(t0 => {
        for (const set of connected) {
          const dot = t0.normal.dot(set[0].normal)
          const angle = Math.acos(
            Math.max(-1, Math.min(1, dot))
          )
          if (angle < Math.PI / 4) {
            set.push(t0)
            return
          }
        }
        connected.push([t0])
      })
      for (let i = 1; i < connected.length; i++) {
        connected[i].forEach(t => {
          if (t.ia === index) {
            t.ia = vertices.length
          }
          if (t.ib === index) {
            t.ib = vertices.length
          }
          if (t.ic === index) {
            t.ic = vertices.length
          }
        })
        vertices.push(vertices[index])
      }
    })
  }

  splitFaces()

  const vertexData = new Float32Array(vertices.flatMap(x => [x.x, x.y, x.z]))
  const indexData = triangles.flatMap(t => [t.ia, t.ib, t.ic])

  geometry.setAttribute('position', new BufferAttribute(vertexData, 3))
  geometry.setIndex(indexData)
  geometry.computeVertexNormals()
  geometry.attributes.normal.needsUpdate = true
  geometry.computeBoundingSphere()

  return geometry
}

/*
 * Basically the expanding polytope algorithm, but with some extra steps.
 */
export function useSupportGeometry (support) {
  const prev = useRef(null)
  return useMemo(() => {
    if (prev.current) {
      prev.current.dispose()
    }
    const ret = makeSupportGeometry(support)
    prev.current = ret
    return ret
  }, [support])
}
