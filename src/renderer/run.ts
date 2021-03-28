import {ipcRenderer} from 'electron'
import {store, errored} from './store'
import {updateCheck} from './update'
import {rpc} from './rpc/client'
import {StatusRequest, StatusResponse} from '@getchill.app/tsclient/lib/rpc'

export const serviceStart = () => {
  ipcRenderer.removeAllListeners('service-started')
  ipcRenderer.on('service-started', (event, err) => {
    if (err) {
      errored(err)
      return
    }

    store.update((s) => {
      s.ready = true
    })

    // Update check
    updateCheck()

    const ping = async () => {
      await rpc.status({})
    }

    const online = () => {
      console.log('Online')
      ping()
    }
    window.addEventListener('online', online)
    // window.addEventListener('offline', offlineFn)

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
  })

  // Start keysd
  ipcRenderer.send('service-start')
}
