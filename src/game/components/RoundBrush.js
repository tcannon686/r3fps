import {
  useMemo
} from 'react'

import {
  sum,
  split,
  sphere,
  circle
} from 'tcollide'

import Brush from './Brush'

/*
 * Like a brush, but with options for making it round.
 */
export default function RoundBrush ({
  support,
  roundRadius,
  flatTop,
  flatBottom,
  ...rest
}) {
  const radius = roundRadius || 0.0

  const roundSupport = useMemo(() => (
    radius > 0
      ? (
          flatTop
            ? (
                flatBottom
                  ? circle({ radius })
                  : split(circle({ radius }), sphere({ radius }))
              )
            : (
                flatBottom
                  ? split(sphere({ radius }), circle({ radius }))
                  : sphere({ radius })
              )
        )
      : null
  ), [radius, flatTop, flatBottom])

  const newSupport = useMemo(() => (
    radius > 0
      ? sum(support, roundSupport)
      : support
  ), [support, roundSupport, radius])

  return <Brush support={newSupport} {...rest} />
}
