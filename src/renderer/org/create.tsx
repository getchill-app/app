import * as React from 'react'

import {Box, Button, Divider, FormControl, FormHelperText, TextField, Typography} from '@material-ui/core'
import Link from '../components/link'

import {rpc} from '../rpc/client'
import {OrgCreateResponse, OrgKeyResponse, OrgSignResponse} from '@getchill.app/tsclient/lib/rpc'

import {openSnack, openSnackError, closeSnack} from '../snack'

import OrgVerify from './verify'

type Props = {}

export default (props: Props) => {
  const [domain, setDomain] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [step, setStep] = React.useState('input')

  const onInputChangeDomain = React.useCallback((e: React.SyntheticEvent<EventTarget>) => {
    let target = e.target as HTMLInputElement
    setDomain(target.value || '')
  }, [])

  const orgKey = async () => {
    setLoading(true)
    try {
      const resp: OrgKeyResponse = await rpc.orgKey({
        domain,
      })
      setLoading(false)
      setStep('verify')
    } catch (err) {
      setLoading(false)
      openSnackError(err)
    }
  }

  const renderInput = () => {
    return (
      <Box display="flex" flexDirection="column" alignItems="center">
        <Typography variant="h1">Create an Organization</Typography>
        <Typography style={{paddingTop: 0, paddingBottom: 10, width: 550, textAlign: 'center'}}>
          An organization is tied to a domain name that you control.
        </Typography>
        <FormControl>
          <TextField
            autoFocus
            label="Domain Name"
            variant="outlined"
            type="domain"
            onChange={onInputChangeDomain}
            value={domain}
            style={{width: 400}}
            disabled={loading}
          />
          <Box padding={1} />
        </FormControl>

        <Box display="flex" flexDirection="row" justifyContent="center" style={{width: 400}}>
          <Button color="primary" variant="outlined" onClick={orgKey} disabled={loading}>
            Next
          </Button>
        </Box>
      </Box>
    )
  }

  const render = () => {
    switch (step) {
      case 'input':
        return renderInput()
      case 'verify':
        return <OrgVerify domain={domain} onCreate={() => {}} />
      default:
        return null
    }
  }

  return render()
}
