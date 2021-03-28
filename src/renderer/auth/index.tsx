import * as React from 'react'

import AuthSetupView from './setup'
import AuthUnlockView from './unlock'
import AuthSplash from './splash'

import {rpc} from '../rpc/client'
import {StatusRequest, StatusResponse, AuthStatus} from '@getchill.app/tsclient/lib/rpc'
import {errored} from '../store'

export default (props: {}) => {
  const [status, setStatus] = React.useState(AuthStatus.AUTH_UNKNOWN)

  const refresh = async () => {
    const resp = await rpc.status({})
    setStatus(resp.authStatus!)
  }

  React.useEffect(() => {
    refresh()
  }, [])

  console.log('Auth status:', status)
  if (status == AuthStatus.AUTH_UNKNOWN) {
    return <AuthSplash />
  }

  if (status == AuthStatus.AUTH_SETUP_NEEDED) {
    return <AuthSetupView refresh={refresh} />
  } else {
    return <AuthUnlockView refresh={refresh} />
  }
}
