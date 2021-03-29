import * as React from 'react'

import {
  Avatar,
  Badge,
  Box,
  Button,
  ButtonBase,
  List,
  ListItem,
  ListItemText,
  Popover,
  Typography,
} from '@material-ui/core'

import UserLabel from '../user/label'

import {CloseIcon, InfoIcon} from '../icons'
import {breakWords} from '../theme'

import {rpc} from '../rpc/client'
import {Key, User} from '@getchill.app/tsclient/lib/rpc'

import {Theme, withStyles, createStyles} from '@material-ui/core/styles'

export enum ConnectStatus {
  Disconnected = 0,
  Connecting = 1,
  Connected = 2,
}

type Props = {
  connectStatus: ConnectStatus
  connect: () => void
  disconnect: () => void
}

const connectStatus = (status: ConnectStatus): string => {
  switch (status) {
    case ConnectStatus.Disconnected:
      return 'Disconnected'
    case ConnectStatus.Connecting:
      return 'Connecting...'
    case ConnectStatus.Connected:
      return 'Connected'
    default:
      return 'Unknown'
  }
}

export default (props: Props) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null)
  const [users, setUsers] = React.useState<User[]>([])

  const setOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const close = () => {
    setAnchorEl(null)
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      style={{
        height: 40,
      }}
    >
      <ButtonBase focusRipple aria-haspopup="true" onClick={setOpen}>
        <Box display="flex" flexDirection="column" paddingTop={1} paddingBottom={1}>
          <Box display="flex" flexDirection="row">
            {/* <Typography>{connectStatus(props.connectStatus)}</Typography> */}
            {props.connectStatus == ConnectStatus.Disconnected && (
              <Box paddingLeft={2}>
                <Typography>{connectStatus(props.connectStatus)}</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </ButtonBase>

      <Popover
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={close}
      >
        <Box display="flex" flexDirection="column" flex={1} style={{width: 270}}>
          {props.connectStatus == ConnectStatus.Connected && (
            <Button
              color="secondary"
              fullWidth
              onClick={() => {
                close()
                props.disconnect()
              }}
            >
              Disconnect
            </Button>
          )}
          {props.connectStatus == ConnectStatus.Disconnected && (
            <Button
              color="primary"
              fullWidth
              onClick={() => {
                close()
                props.connect()
              }}
            >
              Connect
            </Button>
          )}
        </Box>
      </Popover>
    </Box>
  )
}
