import * as React from 'react'

import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@material-ui/core'

import Link from '../components/link'
import {ipcRenderer} from 'electron'

import {store} from '../store'
import {contentTop} from '../theme'

export default (props: {}) => {
  const devTools = () => {
    ipcRenderer.send('toggle-dev-tools', {})
  }

  const forceUpdate = () => {
    ipcRenderer.send('update-force')
    store.update((s) => {
      s.updating = true
    })
  }

  const showError = () => {
    store.update((s) => {
      s.error = new Error('Test error '.repeat(1024))
    })
  }

  const restart = () => {
    ipcRenderer.send('reload-app', {})
  }

  // TODO: Set location
  const setLocation = (location: string) => {}

  return (
    <Box display="flex" flexDirection="column" style={{marginTop: contentTop, marginLeft: 15}}>
      <Typography variant="h4" style={{marginBottom: 10}}>
        Debug
      </Typography>
      <Typography>Experiments</Typography>
      <Typography>DB</Typography>
      <Link onClick={() => setLocation('/settings/debug/db/service')}>Service</Link>
      <Link onClick={() => setLocation('/settings/debug/db/vault')}>Vault</Link>
      <Box margin={1} />

      <Typography>Styles</Typography>
      <Link onClick={() => setLocation('/settings/debug/style-guide')}>Style Guide</Link>
      <Box margin={1} />

      <Typography>Testing</Typography>
      <Link onClick={devTools}>Toggle Dev Tools</Link>
      <Link onClick={forceUpdate}>Force Update</Link>
      <Link onClick={restart}>Restart</Link>
      <Link onClick={showError}>Show Error</Link>
      <Box margin={1} />
    </Box>
  )
}
