const path = require('path')
const Application = require('spectron').Application

const electronPath = path.join(__dirname, '..', 'node_modules', '.bin', 'electron')

const app = new Application({
  path: electronPath,
  args: [path.join(__dirname, '..', 'dist', 'main.js')],
})

const setEnv = (n: number) => {
  process.env.CHILL_APP = 'Keys' + n
  process.env.CHILL_PORT = '222' + n
  process.env.CHILL_BIN = path.join(process.env.HOME, 'go', 'bin', 'keys')
  process.env.CHILL_STOP_ON_EXIT = '1'
}

const sleep = (time: number) => new Promise((r) => setTimeout(r, time))

export {app, setEnv, sleep}
