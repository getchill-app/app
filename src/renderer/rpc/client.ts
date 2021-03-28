import {
  certPath,
  Credentials,
  rpcService,
  fido2Service,
  RPCService,
  FIDO2Service,
  RPCError,
} from '@getchill.app/tsclient'

import * as getenv from 'getenv'

import {lock, errored} from '../store'
import {ConsoleLogger} from './logger'

const appName = getenv.string('CHILL_APP')
const port = getenv.int('CHILL_PORT')

console.log('App:', appName)
console.log('Port:', port)

const cert = certPath(appName)
console.log('Cert:', cert)

export const creds: Credentials = new Credentials(cert)

export const rpc = rpcService('localhost:' + port, creds)
rpc.log = new ConsoleLogger()
rpc.on('unauthenticated', (e: RPCError) => {
  lock()
})
rpc.on('unavailable', (e: RPCError) => {
  errored(e)
})

export const fido2: FIDO2Service = fido2Service('localhost:' + port, creds)
fido2.on('unauthenticated', (e: RPCError) => {
  lock()
})
fido2.on('unavailable', (e: RPCError) => {
  errored(e)
})
