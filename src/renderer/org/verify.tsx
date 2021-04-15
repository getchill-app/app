import * as React from 'react'

import {Box, Button, Divider, FormControl, FormHelperText, TextField, Typography} from '@material-ui/core'
import Link from '../components/link'

import {rpc} from '../rpc/client'
import {OrgCreateResponse, OrgKeyResponse, OrgSignResponse} from '@getchill.app/tsclient/lib/rpc'
import {ipcRenderer} from 'electron'

import {store, unlock} from '../store'
import {openSnack, openSnackError, closeSnack} from '../snack'
import {clipboard, shell} from 'electron'
import {mono} from '../theme'

type Props = {
  domain: string
}

export default (props: Props) => {
  const [sig, setSig] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const orgSign = async () => {
    try {
      const resp: OrgSignResponse = await rpc.orgSign({
        domain: props.domain,
      })
      setSig(resp.sig!)
    } catch (err) {
      openSnackError(err)
    }
  }

  React.useEffect(() => {
    orgSign()
  }, [])

  const orgCreate = async () => {
    setLoading(true)

    try {
      const resp: OrgCreateResponse = await rpc.orgCreate({
        domain: props.domain,
      })
      // Check org status
      const status = await rpc.status({})
      store.update((s) => {
        s.org = status.org
      })
      console.log('Org created', resp)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      openSnackError(err)
    }
  }

  const copyToClipboard = () => {
    clipboard.writeText(sig)
    openSnack({message: 'Copied to Clipboard', duration: 2000})
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Box display="flex" flexDirection="column" alignItems="center">
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
            minHeight: 126,
          }}
        >
          {sig}
        </Typography>
        <Box display="flex" flex={1} flexDirection="row" style={{paddingBottom: 10, marginLeft: 20}}>
          <Button size="small" color="primary" onClick={copyToClipboard} disabled={loading}>
            Copy to Clipboard
          </Button>
        </Box>

        <Box display="flex" flex={1} flexDirection="row" style={{paddingBottom: 20}}>
          <Typography>
            To prove control of the domain, save this signed statement to:
            <br />
            <span style={{...mono}}>https://{props.domain}/.well-known/getchill.txt</span>
          </Typography>
        </Box>
      </Box>

      <Box display="flex" flexDirection="row" justifyContent="center" style={{width: 400}}>
        <Button color="primary" variant="outlined" onClick={orgCreate} disabled={loading}>
          Verify Organization
        </Button>
      </Box>
    </Box>
  )
}
