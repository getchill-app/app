import * as React from 'react'

import {Box, Button, FormControl, FormHelperText, TextField, Typography} from '@material-ui/core'

import Splash from './splash'
import Header from '../header'
import Logo from '../logo'
import Link from '../components/link'

import AuthCreateView from './create'
import AuthLoginView from './login'
import {rpc} from '../rpc/client'
import {AuthStatus} from '@getchill.app/tsclient/lib/rpc'

type Props = {}

export default (props: Props) => {
  const [step, setStep] = React.useState('')

  const status = async () => {
    const status = await rpc.authStatus({})
    switch (status.status) {
      case AuthStatus.AUTH_SETUP_NEEDED:
        setStep('create')
        break
      default:
        setStep('login')
        break
    }
  }

  React.useEffect(() => {
    status()
  }, [])

  const renderCreate = () => {
    return (
      <Box display="flex" flexGrow={1} flexDirection="column" alignItems="center">
        <Header />
        <Logo top={100} />
        <AuthCreateView onCreate={() => {}} />

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

  const renderLogin = () => {
    return (
      <Box display="flex" flexGrow={1} flexDirection="column" alignItems="center">
        <Header />
        <Logo top={100} />
        <AuthLoginView onLogin={() => {}} />
      </Box>
    )
  }

  switch (step) {
    case '':
      return <Splash />
    case 'create':
      return renderCreate()
    case 'login':
      return renderLogin()
    default:
      return null
  }
}
