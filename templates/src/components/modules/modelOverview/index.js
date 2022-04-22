import axios from "axios"
import React, { useEffect, useState } from "react"
import { PORT } from "../../../const"
import { Box } from "../../Box"
import Legend from "../../Legend"
import LineChart from "./LineChart"
import HorizontalTreeChart from "./HorizontalTreeChart"
import TreeTable from "./TreeTable"

const dataColorInfo = {
  lr: "#eb3477",
  knn: "#8934eb",
  nb: "#4ceb34",
}

export default function ModelOverview() {
  const [lineChartData, setLineChartData] = useState()
  const [treeChartData, setTreeChartData] = useState()

  useEffect(() => {
    axios
      .get(
        `http://${window.location.hostname}:${PORT}/static/linechart.json?` +
          Math.random()
      )
      .then((response) => {
        setLineChartData(response.data)
      })
      .catch((error) => {
        console.log(`ERROR - ${error.message}`)
      })

    axios
      .get(
        `http://${window.location.hostname}:${PORT}/static/wine.json?` +
          Math.random()
      )
      .then((response) => {
        setTreeChartData(response.data)
      })
      .catch((error) => {
        console.log(`ERROR - ${error.message}`)
      })
  }, [])

  return (
    <Box title="model-overview">
      <div style={{ display: "flex" }}>
        <div style={{ width: '60%' }}>
          <Legend dataColorInfo={dataColorInfo} />
          <LineChart data={lineChartData} />
          <HorizontalTreeChart data={treeChartData} />
        </div>
        <div style={{ width: '30%' }}>
          <TreeTable />
        </div>
      </div>
    </Box>
  )
}