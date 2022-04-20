import axios from "axios"
import React, { useEffect, useState } from "react"
import { PORT } from "../../../const"
import { Box } from "../../Box"
import HistogramChart from "./HistogramChart"

export default function DetailAction() {
  const [data, setData] = useState([])

  useEffect(() => {
    axios
      .post(
        `http://${window.location.hostname}:${PORT}/histogramchart1?` +
          Math.random(),
        { row: 1, col: 1 }
      )
      .then((response) => {
        setData(response.data)
      })
      .catch((error) => {
        console.log(`ERROR - ${error.message}`)
      })
  }, [])
  return (
    <Box title="detail-action">
      <HistogramChart data={data} />
    </Box>
  )
}
