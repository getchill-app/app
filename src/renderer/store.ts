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
  updating: boolean
  registered: boolean

  focused: boolean

  snackOpen: boolean
  snack?: SnackProps

  settingsOpen: boolean
}

export const store = new Store<State>({
  ready: false,
  updating: false,
  registered: false,
  focused: false,
  snackOpen: false,
  settingsOpen: false,
})

export const errored = (err: Error) => {
  // TODO: Special view for grpc unavailable
  console.error(err)

  // switch (err.code) {
  //   case grpc.status.PERMISSION_DENIED:
  //   case grpc.status.UNAUTHENTICATED:
  //     openSnackError(err as Error)
  //     return
  // }

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
