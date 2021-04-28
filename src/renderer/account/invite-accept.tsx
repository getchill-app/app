import * as React from 'react'

import {Box, Button, Divider, FormControl, FormHelperText, TextField, Typography} from '@material-ui/core'
import Link from '../components/link'

import {rpc, creds} from '../rpc/client'
import {AccountCreateResponse, RandPasswordResponse} from '@getchill.app/tsclient/lib/rpc'
import {ipcRenderer} from 'electron'

import {store} from '../store'
import {openSnack, openSnackError, closeSnack} from '../snack'

import keytar from 'keytar'
import * as grpc from '@grpc/grpc-js'

type Props = {
  onRefresh: () => void
}

export default (props: Props) => {
  const [code, setCode] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const onInputChange = React.useCallback((e: React.SyntheticEvent<EventTarget>) => {
    let target = e.target as HTMLInputElement
    setCode(target.value || '')
  }, [])

  const accountInviteAccept = async () => {
    setLoading(true)
    try {
      const resp = await rpc.accountInviteAccept({
        code,
      })
      setLoading(false)
      props.onRefresh()
    } catch (err) {
      setLoading(false)
      openSnackError(err)
    }
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography style={{paddingTop: 0, paddingBottom: 20, width: 550, textAlign: 'center'}}>
        You should have received an invite code from the person who invited you.
        <br />
        Enter that here:
      </Typography>
      <TextField
        autoFocus
        label="Invite Code"
        variant="outlined"
        onChange={onInputChange}
        value={code}
        style={{width: 400}}
        multiline
        rows={4}
        disabled={loading}
        spellCheck={false}
      />
      <Box padding={1} />

      <Box display="flex" flexDirection="row" justifyContent="center" style={{width: 400}}>
        <Button color="primary" variant="outlined" onClick={accountInviteAccept} disabled={loading}>
          Accept
        </Button>
      </Box>
    </Box>
  )
}
