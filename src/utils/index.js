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

/*
 * Prompts the user to save the given text as the given filename.
 */
export function download (filename, text) {
  const element = document.createElement('a')
  element.setAttribute(
    'href',
    `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`)
  element.setAttribute('download', filename)

  element.style.display = 'none'
  document.body.appendChild(element)

  element.click()

  document.body.removeChild(element)
}

/*
 * Prompts the user to upload a file. Returns a promise that resolves to the
 * text loaded from the file.
 */
export function upload () {
  return new Promise((resolve, reject) => {
    const element = document.createElement('input')
    element.setAttribute('type', 'file')

    element.style.display = 'none'
    document.body.appendChild(element)

    element.addEventListener(
      'change',
      function () {
        this.files[0].text()
          .then((data) => resolve(data))
          .catch((error) => reject(error))
      },
      false)

    element.click()

    document.body.removeChild(element)
  })
}
