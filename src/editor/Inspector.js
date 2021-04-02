/* Material UI components. */
import List from '@material-ui/core/List'

/* Game components. */
import components from '../game/components'
import inspectors from '../game/inspectors'

/* Editor components. */
import ListSection from './ListSection'

export default function Inspector ({ data, selection, onChange }) {
  const selectedObjects = data.objects.filter(x => selection.has(x.id))
  const selectedInspectors = selectedObjects.map(
    x => components[x.type].inspectors
  )
  const objectInspectors = selectedObjects.length > 0
    ? selectedInspectors.reduce((a, x) => x.filter(type => a.includes(type)))
    : []
  return (
    <form noValidate>
      <List>
        {objectInspectors.map(type => {
          const Component = inspectors[type].component
          return (
            <ListSection key={type} title={inspectors[type].displayName}>
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
