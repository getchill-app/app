import * as React from 'react'

import {Box, Button, Divider, FormControl, FormHelperText, TextField, Typography} from '@material-ui/core'
import Link from '../components/link'

import {rpc, creds} from '../rpc/client'
import {AccountCreateResponse, RandPasswordResponse} from '@getchill.app/tsclient/lib/rpc'
import {ipcRenderer} from 'electron'

import {store, unlock} from '../store'
import {openSnack, openSnackError, closeSnack} from '../snack'

import keytar from 'keytar'
import * as grpc from '@grpc/grpc-js'

type Props = {
  onCreate: () => void
}

export default (props: Props) => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const onInputChangeEmail = React.useCallback((e: React.SyntheticEvent<EventTarget>) => {
    let target = e.target as HTMLInputElement
    setEmail(target.value || '')
  }, [])

  const fillDefault = async () => {
    const defaultPassword = await keytar.getPassword('Chill', 'password')
    if (defaultPassword) setPassword(defaultPassword)
  }

  React.useEffect(() => {
    fillDefault()
  }, [])

  const accountCreate = async () => {
    setLoading(true)

    try {
      const resp: AccountCreateResponse = await rpc.accountCreate({
        email: email,
        password: password,
      })
      keytar.setPassword('Chill', 'password', password)
      setLoading(false)
      await unlock(resp.authToken)
      props.onCreate()
    } catch (err) {
      if (err.code == grpc.status.ALREADY_EXISTS) {
        console.log('Account already exists..')
        // TODO: Show login
      }
      setLoading(false)
      openSnackError(err)
    }
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography style={{paddingTop: 0, paddingBottom: 20, width: 550, textAlign: 'center'}}>
        Hi! Let's create an account.
      </Typography>
      <FormControl>
        <TextField
          autoFocus
          label="Email"
          variant="outlined"
          type="email"
          onChange={onInputChangeEmail}
          value={email}
          style={{width: 400}}
          disabled={loading}
        />
        <Box padding={1} />
      </FormControl>
      <Box display="flex" flexDirection="row" justifyContent="center" style={{width: 400}}>
        <Button
          color="primary"
          variant="outlined"
          onClick={accountCreate}
          disabled={loading}
          id="setupPasswordButton"
        >
          Sign Up
        </Button>
      </Box>
    </Box>
  )
}
