import * as getenv from 'getenv'

import {binPath} from './paths'
import {execProc} from './run'

const servicePath = (): string => {
  let path = ''
  if (process.env.NODE_ENV == 'production') {
    path = binPath('keys')
  }
  if (process.env.CHILL_BIN) {
    path = process.env.CHILL_BIN
  }
  console.log('Service path:', path)
  return path
}

export const getAppName = (): string => {
  return getenv.string('CHILL_APP')
}

const getPort = (): number => {
  return getenv.int('CHILL_PORT')
}

export const serviceStart = (): Promise<{}> => {
  const path = servicePath()
  if (!path) {
    return Promise.resolve({})
  }
  const appName = getAppName()
  const port = getPort()

  const arg = '--app=' + appName
  const start = 'start --from=app --port=' + port

  // This returns when the service is ready.
  return execProc(path, arg + ' ' + start)
}

export const serviceStop = (): Promise<any> => {
  const path = servicePath()
  if (path) {
    const appName = getAppName()
    const arg = '--app=' + appName
    return execProc(path, arg + ' stop')
  }
  return Promise.resolve()
}
