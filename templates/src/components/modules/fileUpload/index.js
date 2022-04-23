import React from "react"
import axios from "axios"
import FileUpload from "./FileUpload"
import { PORT } from "../../../const"
import { Box } from "../../Box"

export default function DataUpload() {
  const handleDrop = (files) => {
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
      <FileUpload handleDrop={handleDrop} />
    </Box>
  )
}
