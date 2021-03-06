import * as React from 'react'

import {Box, Divider, Table, TableBody, TableCell, TableRow, Typography} from '@material-ui/core'

import {dateString} from '../helper'
import {rpc} from '../rpc/client'
import {
  Collection,
  Document,
  CollectionsRequest,
  CollectionsResponse,
  DocumentsRequest,
  DocumentsResponse,
} from '@getchill.app/tsclient/lib/rpc'

type Props = {
  db: string
}

type State = {
  collections: Array<Collection>
  documents: Array<Document>
}

export default class DBView extends React.Component<Props, State> {
  state = {
    collections: [],
    documents: [],
  }

  componentDidMount = async () => {
    const req: CollectionsRequest = {
      db: this.props.db,
      parent: '',
    }
    const resp = await rpc.collections(req)

    this.setState({
      collections: resp.collections || [],
      documents: [],
    })
  }

  selectCollection = async (col: Collection) => {
    this.setState({
      documents: [],
    })
    const req: DocumentsRequest = {
      path: col.path,
      db: this.props.db,
    }
    const resp = await rpc.documents(req)
    this.setState({
      documents: resp.documents || [],
    })
  }

  selectDocument = (doc: Document) => {}

  render() {
    const {collections, documents} = this.state
    return (
      <Box display="flex" flexDirection="row" flex={1} style={{position: 'relative', height: 400}}>
        <Box style={{width: 90, paddingTop: 20}}>
          <Table size="small">
            <TableBody>
              {(collections as Collection[]).map((col, index) => (
                <TableRow
                  hover
                  onClick={(event) => this.selectCollection(col)}
                  key={col.path}
                  style={{cursor: 'pointer'}}
                >
                  <TableCell style={{paddingLeft: 8, paddingRight: 8}}>
                    <Typography variant="body2" style={{fontSize: 11}}>
                      {col.path}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
        <Divider orientation="vertical" />
        <Box
          display="flex"
          flex={1}
          style={{position: 'absolute', top: 20, left: 90, bottom: 0, right: 0, overflow: 'auto'}}
        >
          <Table size="small">
            <TableBody>
              {documents.map((doc: Document, index: number) => (
                <TableRow hover onClick={(event) => this.selectDocument(doc)} key={doc.path}>
                  <TableCell>
                    <Box display="flex" flexDirection="column">
                      <Typography
                        variant="body2"
                        style={{fontSize: 11, wordBreak: 'break-all', color: '#666'}}
                      >
                        {doc.path}
                      </Typography>
                      <Typography variant="body2" style={{fontSize: 11, wordBreak: 'break-all'}}>
                        {doc.value}
                      </Typography>
                      <Typography variant="body2" style={{fontSize: 11, wordBreak: 'break-all'}}>
                        {dateString(doc.createdAt)}
                      </Typography>
                      <Typography variant="body2" style={{fontSize: 11, wordBreak: 'break-all'}}>
                        {dateString(doc.updatedAt)}
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>
    )
  }
}
