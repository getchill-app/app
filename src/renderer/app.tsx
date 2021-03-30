import * as React from 'react'

import {Box} from '@material-ui/core'

import ChannelsView from './channels'
import DBDialog from './db/dialog'

export default (_: {}) => {
  return (
    <Box display="flex" flex={1} flexDirection="row" style={{height: '100%'}}>
      <ChannelsView />

      <DBDialog open={false} close={() => {}} />
    </Box>
  )
}

// const lock = async () => {
//   creds.token = ''
//   store.update((s) => {
//     s.unlocked = false
//   })
//   await rpc.authLock({})
// }<IconButton size="small" onClick={lock} id="lockButton">
// <Tooltip title="Lock App" dark>
//   <ScreenLockIcon fontSize="small" style={{marginLeft: 10, color: '#999'}} />
// </Tooltip>
// </IconButton>
