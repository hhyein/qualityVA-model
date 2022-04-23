import React from "react"
import Dropzone from "react-dropzone"
import Input from "../../Input"
import Button from "../../Button"

export default function FileUpload({ handleDrop }) {
  return (
    <div>
      <Dropzone onDrop={handleDrop}>
        {({ getRootProps, getInputProps }) => (
          <div
            style={{ display: "grid", gridAutoFlow: "column" }}
            {...getRootProps()}
          >
            <Input
              disabled
              style={{ borderRadius: "4px 0 0 4px", borderRightWidth: 0 }}
            />
            <Button style={{ borderRadius: "0 4px 4px 0" }}>
              <input {...getInputProps()} />
              Upload
            </Button>
          </div>
        )}
      </Dropzone>
    </div>
  )
}
