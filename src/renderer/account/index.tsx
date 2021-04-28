import * as React from 'react'

import {Box, Button, FormControl, FormHelperText, TextField, Typography} from '@material-ui/core'

import Splash from './splash'
import Header from '../header'
import Logo from '../logo'
import Link from '../components/link'

import RegisterView from './register'
import UsernameView from './username'
import InviteAcceptView from './invite-accept'
import {rpc} from '../rpc/client'
import {AccountStatus} from '@getchill.app/tsclient/lib/rpc'

import {store} from '../store'

type Props = {}

export default (props: Props) => {
  const [step, setStep] = React.useState('')

  const refresh = async () => {
    const status = await rpc.accountStatus({})
    console.log('Status', status)
    switch (status.status) {
      case AccountStatus.ACCOUNT_CREATE:
        setStep('create')
        break
      case AccountStatus.ACCOUNT_USERNAME:
        setStep('username')
        break
      case AccountStatus.ACCOUNT_INVITE_CODE:
        setStep('invite-accept')
        break
      case AccountStatus.ACCOUNT_COMPLETE:
        store.update((s) => {
          s.registered = true
        })
        break
      default:
        setStep('unknown')
        break
    }
  }

  React.useEffect(() => {
    refresh()
  }, [])

  const renderCreate = () => {
    return (
      <Box display="flex" flexGrow={1} flexDirection="column" alignItems="center">
        <Header />
        <Logo top={100} />
        <RegisterView onCreate={refresh} />
      </Box>
    )
  }

  const renderUsername = () => {
    return (
      <Box display="flex" flexGrow={1} flexDirection="column" alignItems="center">
        <Header />
        <Logo top={100} />
        <UsernameView onRefresh={refresh} />
      </Box>
    )
  }

  const renderInviteAccept = () => {
    return (
      <Box display="flex" flexGrow={1} flexDirection="column" alignItems="center">
        <Header />
        <Logo top={100} />
        <InviteAcceptView onRefresh={refresh} />
      </Box>
    )
  }

  switch (step) {
    case '':
      return <Splash />
    case 'create':
      return renderCreate()
    case 'username':
      return renderUsername()
    case 'invite-accept':
      return renderInviteAccept()
    default:
      return <Splash message="Oops, something went wrong" />
  }
}
