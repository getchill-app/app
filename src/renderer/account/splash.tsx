import * as React from 'react'

import {Box, Typography} from '@material-ui/core'

import Logo from '../logo'
import Header from '../header'

type Props = {
  message?: string
}

export default (props: Props) => (
  <Box display="flex" flexGrow={1} flexDirection="column" alignItems="center" style={{height: '100%'}}>
    <Header />
    <Logo top={100} />
    {props.message && <Typography>{props.message}</Typography>}
  </Box>
)
