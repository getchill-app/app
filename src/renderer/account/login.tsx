import * as React from 'react'

import {Box, Button, Divider, FormControl, FormHelperText, TextField, Typography} from '@material-ui/core'
import Link from '../components/link'

import {rpc, creds} from '../rpc/client'
import {AuthUnlockResponse, AuthType} from '@getchill.app/tsclient/lib/rpc'
import {ipcRenderer} from 'electron'

import {store} from '../store'
import {openSnack, openSnackError, closeSnack} from '../snack'

import keytar from 'keytar'

type Props = {
  onLogin: () => void
}

export default (props: Props) => {
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [visible, setVisible] = React.useState(false)

  const onInputChangePassword = React.useCallback((e: React.SyntheticEvent<EventTarget>) => {
    let target = e.target as HTMLInputElement
    setPassword(target.value || '')
  }, [])

  const fillDefault = async () => {
    const defaultPassword = await keytar.getPassword('Chill', 'password')
    if (defaultPassword) {
      setPassword(defaultPassword)
    }
  }

  React.useEffect(() => {
    fillDefault()
  }, [])

  React.useEffect(() => {
    if (password) accountUnlock()
  }, [password])

  const accountUnlock = async () => {
    setLoading(true)

    try {
      const resp: AuthUnlockResponse = await rpc.authUnlock({
        secret: password,
        type: AuthType.PASSWORD_AUTH,
      })
      setLoading(false)
      // TODO: Unlock
      // resp.authToken
      props.onLogin()
    } catch (err) {
      setLoading(false)
      openSnackError(err)
      setVisible(true)
    }
  }
  if (!visible) return null

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography style={{paddingTop: 0, paddingBottom: 20, width: 550, textAlign: 'center'}}>
        We're logging in.
      </Typography>
      <FormControl>
        <TextField
          label="Password"
          variant="outlined"
          type="password"
          onChange={onInputChangePassword}
          value={password}
          style={{width: 400}}
          disabled={loading}
        />
        <Box padding={1} />
      </FormControl>
      <Box display="flex" flexDirection="row" justifyContent="center" style={{width: 400}}>
        <Button color="primary" variant="outlined" onClick={accountUnlock} disabled={loading}>
          Login
        </Button>
      </Box>
    </Box>
  )
}
