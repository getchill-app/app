import * as React from 'react'
import {CSSProperties} from 'react'
import {Box, Typography} from '@material-ui/core'

import UserLabel from '../user/label'

import {Key, User} from '@getchill.app/tsclient/lib/rpc'
import {EDX25519, X25519} from '../rpc/keys'

type IDLabelProps = {
  k: Key
  em?: boolean
  style?: CSSProperties
}

export const IDLabel = (props: IDLabelProps) => {
  const key = props.k
  const isPrivate = key.isPrivate
  let style: CSSProperties = {}
  if (isPrivate && props.em) style.fontWeight = 500
  // width: 520, wordWrap: 'break-word', wordBreak: 'break-all'
  if (props.style) style = {...style, ...props.style}
  return (
    <Typography display="inline" variant="body2" style={{...style}}>
      {key.id}
    </Typography>
  )
}

export const KeyLabel = (props: {k: Key; full?: boolean}) => {
  if (props.full) {
    return (
      <Box display="flex" flexDirection="column">
        {props.k.user && <UserLabel user={props.k.user} />}
        <IDLabel k={props.k} />
      </Box>
    )
  }

  if (props.k.user) {
    return <UserLabel user={props.k.user} />
  }
  return <IDLabel k={props.k} />
}
