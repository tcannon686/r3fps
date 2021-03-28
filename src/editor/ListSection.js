import React, { useState } from 'react'

import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Collapse from '@material-ui/core/Collapse'

import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

/**
 * A list item capable of being expanded or collapsed.
 */
export default function ListSection (props) {
  const [isExpanded, setIsExpanded] = useState(true)
  return (
    <>
      <ListItem button onClick={() => setIsExpanded(!isExpanded)}>
        <ListItemIcon>
          {
            isExpanded
              ? <ExpandLessIcon />
              : <ExpandMoreIcon />
          }
        </ListItemIcon>
        <ListItemText>{props.title}</ListItemText>
      </ListItem>
      <Collapse in={isExpanded}>
        <ListItem>
          {props.children}
        </ListItem>
      </Collapse>
    </>
  )
}
