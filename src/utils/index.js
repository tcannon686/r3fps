import { ConeGeometry, CylinderGeometry } from 'three'

export function makeArrowGeometry (
  segments = 8,
  r1 = 0.05,
  r2 = 0.15
) {
  const geometry = new CylinderGeometry(r1, r1, 1.0, segments, 1)
    .translate(0, 0.5, 0)
  geometry.merge(new ConeGeometry(r2, 0.5, segments, 1).translate(0, 1.25, 0))
  return geometry
}
