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
import DBView from './view'

type Props = {
  open: boolean
  close: () => void
}

type State = {}

export default class DBDialog extends React.Component<Props, State> {
  state: State = {}

  render() {
    return (
      <Dialog onClose={this.props.close} open={this.props.open} maxWidth="xl" fullWidth>
        <DialogContent>
          <DBView db="vault" />
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.close}>Close</Button>
        </DialogActions>
      </Dialog>
    )
  }
}
