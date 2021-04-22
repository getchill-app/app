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
  onCreate: () => void
}

export default (props: Props) => {
  const [step, setStep] = React.useState('register')
  const [email, setEmail] = React.useState('')
  const [verifyCode, setVerifyCode] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const onInputChangeEmail = React.useCallback((e: React.SyntheticEvent<EventTarget>) => {
    let target = e.target as HTMLInputElement
    setEmail(target.value || '')
  }, [])

  const onInputChangeVerifyCode = React.useCallback((e: React.SyntheticEvent<EventTarget>) => {
    let target = e.target as HTMLInputElement
    setVerifyCode(target.value || '')
  }, [])

  const accountRegister = async () => {
    setLoading(true)

    try {
      await rpc.accountRegister({
        email: email,
      })
      setLoading(false)
      setStep('verify')
    } catch (err) {
      setLoading(false)
      openSnackError(err)
    }
  }

  const accountCreate = async () => {
    setLoading(true)

    try {
      const resp: AccountCreateResponse = await rpc.accountCreate({
        email: email,
        code: verifyCode,
      })
      setLoading(false)
      props.onCreate()
    } catch (err) {
      if (err.code == grpc.status.ALREADY_EXISTS) {
        console.log('Account already exists..')
        // TODO: Handle already exists
      }
      setLoading(false)
      openSnackError(err)
    }
  }

  const renderRegister = () => {
    return (
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography style={{paddingTop: 0, paddingBottom: 20, width: 550, textAlign: 'center'}}>
          Hi! Let's register an email address. We'll send you a verification code to enter next.
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
          <Button color="primary" variant="outlined" onClick={accountRegister} disabled={loading}>
            Sign Up
          </Button>
        </Box>
      </Box>
    )
  }

  const renderVerify = () => {
    return (
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography style={{paddingTop: 0, paddingBottom: 20, width: 550, textAlign: 'center'}}>
          We sent you a verification code via email. Enter that code here:
        </Typography>
        <FormControl>
          <TextField
            autoFocus
            label="Code"
            variant="outlined"
            onChange={onInputChangeVerifyCode}
            value={verifyCode}
            style={{width: 400}}
            disabled={loading}
            spellCheck={false}
          />
          <Box padding={1} />
        </FormControl>
        <Box display="flex" flexDirection="row" justifyContent="center" style={{width: 400}}>
          <Button color="primary" variant="outlined" onClick={accountCreate} disabled={loading}>
            Verify
          </Button>
        </Box>
      </Box>
    )
  }

  switch (step) {
    case 'register':
      return renderRegister()
    case 'verify':
      return renderVerify()
    default:
      return null
  }
}
