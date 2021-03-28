import * as React from 'react'

import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  Typography,
} from '@material-ui/core'

import Header from '../header'

import GeneralView from './general'
import AuthenticatorsView from '../authenticators'
import DebugView from './debug'
import StyleGuide from '../style-guide'
import AuthProvisionsView from '../auth/provisions'

import {column1Color} from '../theme'
import {Store} from 'pullstate'

type Props = {}

type Nav = {
  label: string
  location: string
}

const navs: Array<Nav> = [
  {label: 'General', location: '/general'},
  {label: 'Vault', location: '/vault'},
  {label: 'Auth', location: '/auth'},
  {label: 'FIDO2', location: '/fido2'},
  {label: 'Debug', location: '/debug'},
]

type State = {
  location: string
}

const initialState: State = {
  location: '/general',
}

export const store = new Store(initialState)

export default (props: Props) => {
  const selected = store.useState((s) => s.location)

  return (
    <Box display="flex" flexDirection="column" flex={1} style={{height: '100%'}}>
      <Header />
      <Box display="flex" flexGrow={1} flexDirection="row" style={{height: '100%'}}>
        <List
          style={{
            padding: 0,
            backgroundColor: column1Color,
            paddingTop: 26,
          }}
        >
          {navs.map((nav, index) =>
            row(nav, index, selected.startsWith(nav.location), () => {
              store.update((s) => {
                s.location = nav.location
              })
            })
          )}
        </List>
        <Box display="flex" flexDirection="column" flex={1}>
          {selected == '/general' && <GeneralView />}
          {selected == '/auth' && <AuthProvisionsView />}
          {selected == '/fido2' && <AuthenticatorsView />}
          {selected == '/debug' && <DebugView />}
          {selected == '/debug/style-guide' && <StyleGuide />}
        </Box>
      </Box>
    </Box>
  )
}

const row = (nav: Nav, index: number, selected: boolean, onClick: any) => {
  return (
    <ListItem button style={{height: 40}} onClick={onClick} key={nav.location}>
      <ListItemText
        primary={nav.label}
        primaryTypographyProps={{style: {color: selected ? '#2196f3' : ''}}}
      />
    </ListItem>
  )
}
