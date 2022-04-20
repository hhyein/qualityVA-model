import axios from "axios"
import React, { useState } from "react"
import { PORT } from "../../../const"
import { Box } from "../../Box"
import Button from "../../Button"
import Input from "../../Input"
import NL4DV from "./NL4DV"

export default function Visualization() {
  const [dataNL4DV, setNL4DV] = useState()
  const [dataQuery, setQuery] = useState("")

  const handleChange = ({ target: { value } }) => setQuery(value)

  const handleSubmit = (e) => {
    e.preventDefault()
    axios
      .post(
        `http://${window.location.hostname}:${PORT}/query?` + Math.random(),
        dataQuery
      )
      .then((response) => {
        setNL4DV(response.data)
      })
      .catch((error) => {
        console.log(`ERROR - ${error.message}`)
      })
  }
  return (
    <Box
      title="visualization"
      style={{
        display: "grid",
        overflow: "visible",
        gridGap: "5px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{ display: "grid", gridAutoFlow: "column" }}
      >
        <Input
          type="text"
          value={dataQuery}
          onChange={handleChange}
          placeholder="type your query here..."
          style={{ borderRadius: "4px 0 0 4px", borderRightWidth: 0 }}
        />
        <Button type="submit" style={{ borderRadius: "0 4px 4px 0" }}>
          submit
        </Button>
      </form>
      <NL4DV spec={dataNL4DV} />
    </Box>
  )
}
