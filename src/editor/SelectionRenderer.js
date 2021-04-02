/* React. */
import {
  useMemo
} from 'react'

/* react-three-fiber. */
import { useFrame } from 'react-three-fiber'

/* three.js */
import {
  MeshMatcapMaterial,
  CustomBlending,
  OneFactor,
  DstAlphaFactor,
  Color,
  TextureLoader
} from 'three'

/* Material UI. */
import { useTheme } from '@material-ui/core/styles'

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

export default function SelectionRenderer ({ selection }) {
  const selectionMaterial = useSelectionMaterial()

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
