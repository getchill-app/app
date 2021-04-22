import * as React from 'react'

import {Box} from '@material-ui/core'

import {store} from './store'

import ChannelsView from './channels'
import SettingsDialog from './settings/dialog'

export default (_: {}) => {
  const {settingsOpen} = store.useState()
  const close = () => {
    store.update((s) => {
      s.settingsOpen = false
    })
  }

  return (
    <Box display="flex" flex={1} flexDirection="row" style={{height: '100%'}}>
      <ChannelsView />

      <SettingsDialog open={settingsOpen} close={close} />
    </Box>
  )
}
