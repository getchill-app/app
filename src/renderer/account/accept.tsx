import * as React from 'react'

import {Box, Button, FormControl, FormHelperText, TextField, Typography} from '@material-ui/core'

import Header from '../header'
import Logo from '../logo'
import Link from '../components/link'

type Props = {
  onRefresh: () => void
}

export default (props: Props) => {
  return (
    <Box display="flex" flexGrow={1} flexDirection="column" alignItems="center">
      <Typography>
        Great! You've registered. Now we'll need to wait for you to be accepted onto the server.
      </Typography>

      <Box display="flex" flexDirection="row" justifyContent="center" style={{width: 400}}>
        <Button color="primary" variant="outlined" onClick={props.onRefresh}>
          Check
        </Button>
      </Box>
    </Box>
  )
}
