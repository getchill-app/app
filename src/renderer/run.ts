import {ipcRenderer} from 'electron'
import {store, errored} from './store'
import {updateCheck} from './update'
import {creds, rpc} from './rpc/client'
import {AccountStatus, AuthType} from '@getchill.app/tsclient/lib/rpc'
import keytar from 'keytar'

export const serviceStart = () => {
  ipcRenderer.removeAllListeners('service-started')
  ipcRenderer.on('service-started', (event, err) => {
    if (err) {
      errored(err)
      return
    }
    serviceStarted()
  })
}

export const serviceStarted = async () => {
  console.log('Service started')
  // Update check
  updateCheck()

  const ping = async () => {
    console.log('Ping')
    rpc.authStatus({})
  }
  window.addEventListener('online', ping)

  ipcRenderer.removeAllListeners('focus')
  ipcRenderer.on('focus', (event, message) => {
    store.update((s) => {
      s.focused = true
    })
    ping()
  })

  ipcRenderer.on('blur', (event, message) => {
    store.update((s) => {
      s.focused = false
    })
  })

  try {
    console.log('Account unlock...')
    // Get or set a default password
    let password = await keytar.getPassword('Chill', 'defaultPassword')
    if (!password) {
      const resp = await rpc.randPassword({})
      password = resp.password || ''
      await keytar.setPassword('Chill', 'defaultPassword', password)
    }
    const resp = await rpc.authUnlock({
      secret: password,
      type: AuthType.PASSWORD_AUTH,
    })
    creds.token = resp.authToken!

    const status = await rpc.accountStatus({})
    const registered = status.status == AccountStatus.ACCOUNT_COMPLETE

    store.update((s) => {
      s.ready = true
      s.registered = registered
    })
  } catch (err) {
    errored(err)
  }
}

// Start service
console.log('Service start...')
ipcRenderer.send('service-start')
