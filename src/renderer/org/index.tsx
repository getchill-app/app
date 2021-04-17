import * as React from 'react'

import {Box, Button, FormControl, FormHelperText, TextField, Typography} from '@material-ui/core'

import Header from '../header'
import Logo from '../logo'
import Link from '../components/link'

import OrgCreateView from './create'

type Props = {
  onCreate: () => void
}

export default (props: Props) => {
  const [step, setStep] = React.useState('')

  const clear = () => {
    setStep('')
  }

  const connect = () => {
    // setStep('vault')
  }

  const renderIntro = () => {
    return (
      <Box display="flex" flexGrow={1} flexDirection="column" alignItems="center">
        <Header />
        <Logo top={100} />
        <OrgCreateView />
      </Box>
    )
  }

  switch (step) {
    case '':
      return renderIntro()
    default:
      return null
  }
}
