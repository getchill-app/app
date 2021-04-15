import {ipcRenderer} from 'electron'
import {store, errored} from './store'
import {updateCheck} from './update'
import {rpc} from './rpc/client'
import {AuthStatus, StatusRequest, StatusResponse} from '@getchill.app/tsclient/lib/rpc'

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

  // Get current app status
  const status = await rpc.authStatus({})
  console.log('Auth status ready', status)
  if (status.status == AuthStatus.AUTH_UNLOCKED) {
    const status = await rpc.status({})
    store.update((s) => {
      s.ready = true
      s.org = status.org
    })
  } else {
    store.update((s) => {
      s.ready = true
    })
  }
}

// Start service
console.log('Service start...')
ipcRenderer.send('service-start')
