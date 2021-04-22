import * as React from 'react'

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Input,
  InputLabel,
  FormControl,
  FormHelperText,
  TextField,
  Typography,
} from '@material-ui/core'

import Snack, {SnackProps} from '../components/snack'
import SettingsView from './index'

type Props = {
  open: boolean
  close: () => void
}

export default (props: Props) => {
  return (
    <Dialog onClose={props.close} open={props.open} maxWidth="xl" fullWidth>
      <Box display="flex" flexDirection="column" flex={1} style={{minHeight: 450}}>
        <SettingsView />
      </Box>
      <DialogActions>
        <Button onClick={props.close}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
