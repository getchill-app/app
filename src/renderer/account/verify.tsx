import * as React from 'react'

import {Box, Button, Divider, FormControl, FormHelperText, TextField, Typography} from '@material-ui/core'
import Link from '../components/link'

import {rpc} from '../rpc/client'
import {AccountVerifyResponse} from '@getchill.app/tsclient/lib/rpc'
import {ipcRenderer} from 'electron'

import {store} from '../store'
import {openSnack, openSnackError, closeSnack} from '../snack'

import keytar from 'keytar'
import * as grpc from '@grpc/grpc-js'

type Props = {
  onVerify: () => void
}

export default (props: Props) => {
  const [code, setCode] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const onInputChange = React.useCallback((e: React.SyntheticEvent<EventTarget>) => {
    let target = e.target as HTMLInputElement
    setCode(target.value || '')
  }, [])

  const accountVerify = async () => {
    setLoading(true)

    try {
      const resp: AccountVerifyResponse = await rpc.accountVerify({
        code: code,
      })
      setLoading(false)
      props.onVerify()
    } catch (err) {
      setLoading(false)
      openSnackError(err)
    }
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography style={{paddingTop: 0, paddingBottom: 20, width: 550, textAlign: 'center'}}>
        Verify.
      </Typography>
      <FormControl>
        <TextField
          autoFocus
          label="Code"
          variant="outlined"
          type="code"
          onChange={onInputChange}
          value={code}
          style={{width: 400}}
          disabled={loading}
        />
        <Box padding={1} />
      </FormControl>
      <Box display="flex" flexDirection="row" justifyContent="center" style={{width: 400}}>
        <Button color="primary" variant="outlined" onClick={accountVerify} disabled={loading}>
          Verify
        </Button>
      </Box>
    </Box>
  )
}
