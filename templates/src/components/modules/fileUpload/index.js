import React from "react"
import { Box } from "../../Box"
import Dropzone from "react-dropzone"
import Input from "../../Input"
import Button from "../../Button"
import { useFileData } from "../../../contexts/FileDataContext"
import axios from "axios"
import { PORT } from "../../../const"

export default function FileUpload() {
  const { file, setFile } = useFileData()

  const handleDrop = (files) => {
    setFile(files[0])
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
        console.log(`ERROR - ${error.message}`)
      })
  }

  return (
    <Box title="data-upload">
      <Dropzone
        accept=".csv, application/vnd.ms-excel, text/csv"
        onDrop={handleDrop}
      >
        {({ getRootProps, getInputProps }) => (
          <div
            style={{ display: "grid", gridAutoFlow: "column" }}
            {...getRootProps()}
          >
            <Input
              disabled
              value={file?.name ?? ""}
              style={{ borderRadius: "4px 0 0 4px", borderRightWidth: 0 }}
            />
            <Button style={{ borderRadius: "0 4px 4px 0" }}>
              <input {...getInputProps()} />
              Upload
            </Button>
          </div>
        )}
      </Dropzone>
    </Box>
  )
}
