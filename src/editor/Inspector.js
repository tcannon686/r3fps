/* Material UI components. */
import List from '@material-ui/core/List'

/* Game components. */
import components from '../game/components'

/* Editor components. */
import ListSection from './ListSection'

export default function Inspector ({ data, selection, onChange }) {
  const selectedObjects = data.objects.filter(x => selection.has(x.id))
  const selectedInspectors = selectedObjects.map(
    x => components[x.type].inspectors
  )
  const objectInspectors = selectedObjects.length > 0
    ? selectedInspectors.reduce((a, x) => x.filter(
        inspector => a.includes(inspector))
      )
    : []
  return (
    <form noValidate>
      <List>
        {objectInspectors.map(inspector => {
          const Component = inspector.component
          return (
            <ListSection key={inspector.key} title={inspector.displayName}>
              <Component
                data={data}
                selection={selection}
                onChange={onChange}
              />
            </ListSection>
          )
        })}
      </List>
    </form>
  )
}
