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
    <Box title="model-overview" style={{ display: "grid", height: '100%', gridTemplateColumns: '1.5fr 1fr', gridAutoFlow: 'column', padding: 0 }}>
      <div style={{ minHeight: 0, display: 'grid', gridTemplateRows: 'auto 1fr 40px', padding: '10px',  boxSizing: 'border-box'}}>
        <Legend dataColorInfo={dataColorInfo} />
        <LineChart data={lineChartData} />
        <HorizontalTreeChart data={treeChartData} />
      </div>
      <div style={{ minHeight: 0, overflow: 'auto'}}>
        <TreeTable />
      </div>
    </Box>
  )
}