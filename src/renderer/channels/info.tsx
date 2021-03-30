import * as React from 'react'

import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Table,
  TableBody,
  TableRow,
  TableCell,
  TextField,
  Typography,
} from '@material-ui/core'

import {CloseIcon, InfoIcon} from '../icons'
import {breakWords} from '../theme'

import {rpc} from '../rpc/client'
import {Channel} from '@getchill.app/tsclient/lib/rpc'

import {openSnack, openSnackError} from '../snack'

type Props = {
  open: boolean
  onClose: () => void
  channel: Channel
}

export default (props: Props) => {
  const channelLeave = async () => {
    try {
      const resp = await rpc.channelLeave({
        channel: props.channel.id,
      })
      props.onClose()
    } catch (err) {
      openSnackError(err)
    }
  }

  return (
    <Drawer anchor="right" open={props.open} onClose={props.onClose}>
      <Box paddingLeft={2} position="relative" style={{width: 400}}>
        <Box position="absolute" right={6} top={6}>
          <IconButton size="small" color="secondary" onClick={props.onClose}>
            <CloseIcon fontSize="small" style={{color: '#666'}} />
          </IconButton>
        </Box>
        <Typography variant="h4" style={{paddingTop: 10, paddingBottom: 6, fontWeight: 500}}>
          Channel
        </Typography>
        <Table size="small">
          <TableBody>
            <TableRow>
              <TableCell>
                <Typography align="right">ID</Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" style={{width: 260, ...breakWords}}>
                  {props.channel.id}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography align="right">Name</Typography>
              </TableCell>
              <TableCell>
                <Typography style={{width: 260, ...breakWords}}>{props.channel.name}</Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography align="right"></Typography>
              </TableCell>
              <TableCell>
                <Button color="primary" variant="outlined" size="small" onClick={channelLeave}>
                  Leave Channel
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Box>
    </Drawer>
  )
}
