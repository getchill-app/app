import * as React from 'react'

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  TextField,
  Typography,
} from '@material-ui/core'
import Link from '../components/link'

import {rpc, creds} from '../rpc/client'

import {store} from '../store'
import {openSnack, openSnackError, closeSnack} from '../snack'

type Props = {
  open: boolean
  close: () => void
}

export default (props: Props) => {
  const [step, setStep] = React.useState('invite')
  const [email, setEmail] = React.useState('')
  const [inviteCode, setInviteCode] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const onInputChange = React.useCallback((e: React.SyntheticEvent<EventTarget>) => {
    let target = e.target as HTMLInputElement
    setEmail(target.value || '')
  }, [])

  const accountInvite = async () => {
    setLoading(true)
    try {
      const resp = await rpc.accountInvite({
        email,
      })
      setLoading(false)
      setInviteCode(resp.inviteCode!)
      setStep('code')
    } catch (err) {
      setLoading(false)
      openSnackError(err)
    }
  }

  const renderInvite = () => {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        marginLeft={2}
        marginRight={2}
      >
        <Box margin={1} />
        <Typography variant="h3">Invite to Chill</Typography>
        <Box margin={1} />
        <TextField
          autoFocus
          label="Email"
          variant="outlined"
          onChange={onInputChange}
          value={email}
          style={{width: 400}}
          disabled={loading}
          spellCheck={false}
        />
        <Box padding={1} />
        <Typography style={{width: 400}}>
          In order to sign up, they must register with the email address you enter here.
        </Typography>
        <Box padding={1} />

        <DialogActions>
          <Button onClick={props.close} disabled={loading}>
            Cancel
          </Button>
          <Button color="primary" variant="outlined" onClick={accountInvite} disabled={loading}>
            Next
          </Button>
        </DialogActions>
      </Box>
    )
  }

  const renderCode = () => {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" marginLeft={2} marginRight={2}>
        <DialogTitle>
          <Typography variant="h3">Invite to Chill</Typography>
        </DialogTitle>
        <Typography style={{paddingTop: 0, paddingBottom: 20, width: 550, textAlign: 'center'}}>
          You'll need to send them the following code (via email, text message, etc) so they can accept your
          invite:
        </Typography>
        <Typography
          variant="body2"
          style={{
            marginBottom: 5,
            marginLeft: 20,
            backgroundColor: 'black',
            color: 'white',
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 10,
            paddingBottom: 10,
            fontSize: 12,
            width: 500,
          }}
        >
          {inviteCode}
        </Typography>
        <DialogActions>
          <Button color="primary" onClick={props.close} disabled={loading}>
            Close
          </Button>
        </DialogActions>
      </Box>
    )
  }

  return (
    <Dialog onClose={props.close} open={props.open}>
      {step == 'invite' && renderInvite()}
      {step == 'code' && renderCode()}
    </Dialog>
  )
}
