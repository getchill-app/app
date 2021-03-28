import {Store} from 'pullstate'

import {rpc, creds} from './rpc/client'
import {SnackProps} from './components/snack'
import * as grpc from '@grpc/grpc-js'
import {openSnackError} from './snack'

export interface Error {
  name: string
  message: string
  details?: string
  code?: number
}

export type State = {
  error?: Error
  ready: boolean
  unlocked: boolean
  updating: boolean

  focused: boolean
  fido2Enabled: boolean

  snackOpen: boolean
  snack?: SnackProps
}

export const store = new Store<State>({
  ready: false,
  unlocked: false,
  updating: false,
  fido2Enabled: false,

  focused: false,
  snackOpen: false,
})

export const loadStatus = async () => {
  const status = await rpc.status({})
  store.update((s) => {
    s.fido2Enabled = !!status.fido2
  })
}

export const unlock = async (authToken?: string) => {
  if (!authToken) {
    throw new Error('no auth token')
  }
  creds.token = authToken
  store.update((s) => {
    s.unlocked = true
  })
}

export const lock = () => {
  creds.token = ''
  store.update((s) => {
    s.unlocked = false
  })
}

export const errored = (err: Error) => {
  // TODO: Special view for grpc unavailable
  console.error(err)

  switch (err.code) {
    case grpc.status.PERMISSION_DENIED:
    case grpc.status.UNAUTHENTICATED:
      console.log('Locking...')
      lock()
      openSnackError(err as Error)
      return
  }

  store.update((s) => {
    s.error = err
  })
}

export const once = <A extends any[], R, T>(
  fn: (this: T, ...arg: A) => R
): ((this: T, ...arg: A) => R | undefined) => {
  let done = false
  return function (this: T, ...args: A) {
    return done ? void 0 : ((done = true), fn.apply(this, args))
  }
}
