/* Material UI components. */
import Fade from '@material-ui/core/Fade'
import Box from '@material-ui/core/Box'

export default function TabPanel (props) {
  const { children, value, index, ...other } = props

  return (
    <Fade
      in={value === index}
      style={{
        display: value === index ? 'block' : 'none'
      }}
    >
      <div
        role='tabpanel'
        {...other}
      >
        <Box>
          {children}
        </Box>
      </div>
    </Fade>
  )
}
