import * as os from 'os'

export const platform = (): NodeJS.Platform => {
  let platform = os.platform()
  if (process.env.CHILL_PLATFORM) {
    platform = process.env.CHILL_PLATFORM as NodeJS.Platform
  }
  return platform
}
