import React, { useState, useEffect } from "react"
import axios from "axios"
import Dropzone from "react-dropzone"
import Input from "./Input"
import Button from "./Button"

function Fileupload() {
  const [data, setData] = useState([])
  const PORT = 5000

  const dropHandler = (files) => {
    var formData = new FormData()
    const config = {
      header: { "content-type": "multipart/form-data" },
    }
    formData.append("file", files[0])
    axios
      .post(
        `http://${window.location.hostname}:${PORT}/fileUpload?` +
          Math.random(),
        formData,
        config
      )
      .then((response) => {
        console.log(response.data)
      })
      .catch((error) => {
        alert(`ERROR - ${error.message}`)
      })
  }

  return (
    <div>
      <Dropzone onDrop={dropHandler}>
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

export default Fileupload
