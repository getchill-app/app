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

  const buttonColor = (connectStatus: ConnectStatus) => {
    switch (connectStatus) {
      case ConnectStatus.Connected:
        return 'primary'
      default:
        return 'secondary'
    }
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      style={{
        height: 40,
      }}
    >
      <Box display="flex" flexDirection="row" justifyContent="center">
        <Button
          size="small"
          aria-haspopup="true"
          onClick={setOpen}
          variant="outlined"
          color={buttonColor(props.connectStatus)}
          style={{width: 140}}
        >
          {connectStatus(props.connectStatus)}
        </Button>
      </Box>

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
        <Box display="flex" flexDirection="column" flex={1} style={{width: 140}}>
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
