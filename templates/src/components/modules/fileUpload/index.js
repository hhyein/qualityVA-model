import React from 'react'
import { Box } from '../../Box'
import Dropzone from 'react-dropzone'
import Input from '../../Input'
import Button from '../../Button'

export default function FileUpload({ fileName, handleDrop }) {
  return (
    <Box title="data-upload">
      <Dropzone
        accept=".csv, application/vnd.ms-excel, text/csv"
        onDrop={handleDrop}
      >
        {({ getRootProps, getInputProps }) => (
          <div
            style={{ display: 'grid', gridAutoFlow: 'column' }}
            {...getRootProps()}
          >
            <Input
              disabled
              value={fileName ?? ''}
              style={{ borderRadius: '4px 0 0 4px', borderRightWidth: 0 }}
            />
            <Button style={{ borderRadius: '0 4px 4px 0' }}>
              <input {...getInputProps()} />
              Upload
            </Button>
          </div>
        )}
      </Dropzone>
    </Box>
  )
}
