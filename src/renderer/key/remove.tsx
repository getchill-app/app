import * as React from 'react'

import {Box, Button, Typography} from '@material-ui/core'

import Dialog from '../components/dialog'
import {KeyLabel} from './label'
import {openSnack, openSnackError} from '../snack'

import {rpc} from '../rpc/client'
import {EDX25519, X25519} from '../rpc/keys'
import {Key} from '@getchill.app/tsclient/lib/rpc'

type Props = {
  open?: boolean
  k: Key
  close: (removed: boolean) => void
}

export default (props: Props) => {
  const removeKey = async () => {
    try {
      const resp = await rpc.keyRemove({kid: props.k.id})
      props.close(true)
    } catch (err) {
      openSnackError(err)
    }
  }

  const key = props.k
  const open = props.open
  const isPrivate = key.isPrivate

  return (
    <Dialog
      open={!!open}
      close={{label: 'Cancel', action: () => props.close(false)}}
      title="Delete Key"
      actions={[{label: 'Delete', action: removeKey, color: 'secondary'}]}
    >
      {isPrivate ? <PrivateKey k={props.k} /> : <PublicKey k={props.k} />}
    </Dialog>
  )
}

const PrivateKey = (props: {k: Key}) => {
  return (
    <Box>
      <Typography style={{paddingBottom: 10}}>
        Are you really sure you want to delete this <span style={{fontWeight: 600}}>private</span> key?
      </Typography>
      <Box style={{paddingBottom: 10}}>
        <KeyLabel k={props.k} full />
      </Box>
      <Typography>
        <span style={{fontWeight: 600}}>
          If you haven't backed up the key, you won't be able to recover it.
        </span>
      </Typography>
    </Box>
  )
}

const PublicKey = (props: {k: Key}) => {
  return (
    <Box style={{paddingBottom: 10}}>
      <Typography style={{paddingBottom: 10}}>Are you sure you want to delete this public key?</Typography>
      <KeyLabel k={props.k} full />
    </Box>
  )
}
