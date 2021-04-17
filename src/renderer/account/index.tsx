import * as React from 'react'

import {Box, Button, FormControl, FormHelperText, TextField, Typography} from '@material-ui/core'

import Splash from './splash'
import Header from '../header'
import Logo from '../logo'
import Link from '../components/link'

import CreateView from './create'
import LoginView from './login'
import VerifyView from './verify'
import OrgView from '../org'
import {rpc} from '../rpc/client'
import {AccountStatus} from '@getchill.app/tsclient/lib/rpc'

import {store} from '../store'

type Props = {}

export default (props: Props) => {
  const {unlocked} = store.useState()
  const [step, setStep] = React.useState(!unlocked ? 'login' : '')

  const refresh = async () => {
    const status = await rpc.accountStatus({})
    console.log('Status', status)
    switch (status.status) {
      case AccountStatus.ACCOUNT_SETUP_NEEDED:
        setStep('create')
        break
      case AccountStatus.ACCOUNT_UNVERIFIED:
        setStep('verify')
        break
      case AccountStatus.ACCOUNT_ORG_NEEDED:
        setStep('org')
        break
      case AccountStatus.ACCOUNT_LOCKED:
        setStep('login')
        break
      case AccountStatus.ACCOUNT_REGISTERED:
        setStep('registered')
        break
      default:
        setStep('login')
        break
    }
  }

  React.useEffect(() => {
    if (unlocked) refresh()
  }, [unlocked])

  const renderCreate = () => {
    return (
      <Box display="flex" flexGrow={1} flexDirection="column" alignItems="center">
        <Header />
        <Logo top={100} />
        <CreateView onCreate={refresh} />

        {/* <Box style={{paddingTop: 10}}>
          <Typography style={{width: 550, marginTop: 10, textAlign: 'center'}}>
            Do you want to{' '}
            <Link span onClick={connect}>
              connect to an existing account?
            </Link>
          </Typography>
        </Box> */}
      </Box>
    )
  }

  const renderVerify = () => {
    return (
      <Box display="flex" flexGrow={1} flexDirection="column" alignItems="center">
        <Header />
        <Logo top={100} />
        <VerifyView onVerify={refresh} />
      </Box>
    )
  }

  const renderOrg = () => {
    return <OrgView onCreate={refresh} />
  }

  const renderLogin = () => {
    return (
      <Box display="flex" flexGrow={1} flexDirection="column" alignItems="center">
        <Header />
        <Logo top={100} />
        <LoginView onLogin={refresh} />
      </Box>
    )
  }

  switch (step) {
    case 'create':
      return renderCreate()
    case 'verify':
      return renderVerify()
    case 'org':
      return renderOrg()
    case 'login':
      return renderLogin()
    default:
      return null
  }
}
