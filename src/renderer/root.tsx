import * as React from 'react'

import {ThemeProvider} from '@material-ui/styles'
import {theme} from './theme'

import {store, errored} from './store'
import {closeSnack} from './snack'
import {ipcRenderer, remote} from 'electron'
import Snack, {SnackProps} from './components/snack'

import Auth from './auth'
import AuthSplash from './auth/splash'
import App from './app'

import {Box, Typography} from '@material-ui/core'
import Errors from './errors'
import UpdateAlert from './update/alert'
import UpdateSplash from './update/splash'

import {serviceStart} from './run'

import './app.css'

const Root = (_: {}) => {
  const {ready, unlocked, updating} = store.useState((s) => ({
    ready: s.ready,
    unlocked: s.unlocked,
    updating: s.updating,
  }))

  React.useEffect(() => {
    if (!ready) serviceStart()
  }, [])

  ipcRenderer.removeAllListeners('preferences')
  ipcRenderer.on('preferences', (event, message) => {
    // TODO: Show settings
  })

  if (updating) {
    return <UpdateSplash />
  }

  if (!ready) {
    return <AuthSplash />
  }

  if (!unlocked) {
    return <Auth />
  }

  return <App />
}

export default (_: {}) => {
  const {snack, snackOpen} = store.useState((s) => ({
    snack: s.snack,
    snackOpen: s.snackOpen,
  }))

  return (
    <ThemeProvider theme={theme}>
      <Box display="flex" flex={1} flexDirection="row" style={{height: '100%'}}>
        <Root />
        <Errors />
        <UpdateAlert />
        <Snack open={snackOpen} {...snack} onClose={closeSnack} />
      </Box>
    </ThemeProvider>
  )
}

ipcRenderer.removeAllListeners('log')
ipcRenderer.on('log', (event, text) => {
  console.log('Main process:', text)
})

// ipcRenderer.on('unresponsive', (event, message) => {})

// ipcRenderer.on('responsive', (event, message) => {})

// window.addEventListener('error', (event) => {
//   event.preventDefault()
//   errored(event.error || event)
// })

window.addEventListener('unhandledrejection', (event) => {
  event.preventDefault()
  console.error('Unhandled rejection')
  errored(event.reason)
})
