import * as React from 'react'

import {
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from '@material-ui/core'

import {AddIcon, RefreshIcon} from '../icons'

import Header from '../header'
import {Store} from 'pullstate'
import {Error} from '../store'
import {contentTop, column2Color} from '../theme'
import {openSnack, openSnackError} from '../snack'

import * as grpc from '@grpc/grpc-js'
import {rpc} from '../rpc/client'
import {RPCError, ClientReadableStream} from '@getchill.app/tsclient'
import {Channel, User, UserStatus} from '@getchill.app/tsclient/lib/rpc'
import {RelayOutput} from '@getchill.app/tsclient/lib/rpc'

import ChannelView from './channel'
import ChannelCreateView from './create'
import StatusView, {ConnectStatus} from './status'

type Props = {}

type State = {
  channels: Channel[]
  input: string
  selected?: Channel
}

const initialState: State = {
  channels: [],
  input: '',
}

const store = new Store(initialState)

const refresh = async () => {
  try {
    const resp = await rpc.channels({})
    const channels = resp.channels || []
    store.update((s) => {
      s.channels = channels

      let selected = resp.channels?.find((c: Channel) => c.id == s.selected?.id)
      if (!selected && channels.length > 0) selected = channels[0]
      s.selected = selected
    })
  } catch (err) {
    openSnackError(err)
  }
}

export default (props: Props) => {
  const {channels, selected} = store.useState()

  const [connectStatus, setConnectStatus] = React.useState(ConnectStatus.Disconnected)

  const [createOpen, setCreateOpen] = React.useState(false)

  const stream = React.useRef<ClientReadableStream<RelayOutput> | null>(null)

  React.useEffect(() => {
    refresh()
  }, [])

  const setOnline = () => {
    console.log('Online')
    connect()
  }

  const setOffline = () => {
    console.log('Offline')
    setConnectStatus(ConnectStatus.Disconnected)
  }

  React.useEffect(() => {
    window.addEventListener('offline', setOffline)
    return () => {
      window.removeEventListener('offline', setOffline)
    }
  }, [])

  React.useEffect(() => {
    window.addEventListener('online', setOnline)
    return () => {
      window.removeEventListener('offline', setOnline)
    }
  }, [])

  const select = (channel: Channel) => {
    console.log('Select channel', channel)
    store.update((s) => {
      s.selected = channel
    })
  }

  let cancelling = false
  const connect = () => {
    console.log('Relay connect...')
    setConnectStatus(ConnectStatus.Connecting)
    const relay = rpc.relay({})
    stream.current = relay
    relay.on('data', (relay: RelayOutput) => {
      console.log('Relay output', relay)
      refresh()
      setConnectStatus(ConnectStatus.Connected)
    })
    relay.on('error', (err: RPCError) => {
      if (err.code == grpc.status.CANCELLED) {
        console.log('Relay cancelled')
      } else {
        openSnackError(err)
      }
    })
    relay.on('end', () => {
      console.log('Relay end')
      if (!cancelling) setConnectStatus(ConnectStatus.Disconnected)
    })
  }

  const disconnect = () => {
    console.log('Relay disconnect')
    stream.current?.cancel()
  }

  React.useEffect(() => {
    connect()
    return () => {
      console.log('Relay cancel')
      cancelling = true
      disconnect()
    }
  }, [])

  const closeCreate = (channel?: Channel) => {
    setCreateOpen(false)
    if (channel) {
      store.update((s) => {
        s.selected = channel
      })
    }
  }

  return (
    <Box display="flex" flexDirection="column" flex={1} style={{height: '100%'}} id="inboxView">
      <Header />
      <Box display="flex" flexDirection="row" flex={1} style={{height: '100%', position: 'relative'}}>
        <Box display="flex" flexDirection="column" style={{width: 270, background: column2Color}}>
          <Box
            display="flex"
            flexDirection="row"
            style={{paddingLeft: 8, paddingTop: 26}}
            alignItems="center"
          >
            <Box display="flex" flexGrow={1} />
            <IconButton color="primary" size="small" onClick={() => setCreateOpen(true)}>
              <AddIcon />
            </IconButton>
          </Box>
          <Box display="flex" flexDirection="column" flex={1} style={{position: 'relative'}}>
            <Box
              style={{
                position: 'absolute',
                width: 270,
                left: 0,
                top: 0,
                bottom: 40,
                overflowX: 'hidden',
                overflowY: 'auto',
              }}
            >
              <Table size="small">
                <TableBody>
                  {channels.map((channel, index) => {
                    return (
                      <TableRow
                        hover
                        onClick={() => select(channel)}
                        key={channel.id}
                        style={{cursor: 'pointer'}}
                        selected={selected?.id == channel?.id}
                        component={(props: any) => {
                          return <tr {...props} id={channel.id} />
                        }}
                      >
                        <TableCell component="th" scope="row" style={{verticalAlign: 'top'}}>
                          <Typography
                            noWrap
                            style={{
                              ...nowrapStyle,
                              paddingBottom: 2,
                              fontSize: '1.05em',
                              fontWeight: 500,
                            }}
                          >
                            #{channel.name || channel.id}
                          </Typography>
                          <Typography noWrap style={{...nowrapStyle, color: '#777777'}}>
                            {channel.snippet || '-'}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </Box>
            <Box
              style={{
                position: 'absolute',
                width: 270,
                height: 40,
                bottom: 0,
                left: 0,
                right: 0,
                overflow: 'hidden',
              }}
            >
              <StatusView connectStatus={connectStatus} connect={connect} disconnect={disconnect} />
            </Box>
          </Box>
        </Box>
        <Box display="flex" flex={1}>
          {selected && <ChannelView channel={selected} index={selected!.index!} />}
        </Box>
      </Box>
      {<ChannelCreateView open={createOpen} close={closeCreate} />}
    </Box>
  )
}

const nowrapStyle = {
  textOverflow: 'ellipsis',
  overflow: 'hidden',
  width: 240,
}
