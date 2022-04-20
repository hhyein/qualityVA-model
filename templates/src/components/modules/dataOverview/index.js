import axios from "axios"
import React, { useEffect, useState } from "react"
import { PORT } from "../../../const"
import HorizontalBarChart from "../../charts/HorizontalBarChart"
import Legend from "../../Legend"
import HeatmapChart from "../../charts/HeatmapChart"
import { Box } from "../../Box"

const dataColorInfo = {
  missing: "steelblue",
  outlier: "orange",
  incons: "darkgreen",
}

export default function DataOverview({ columnList }) {
  const [barChartData, setBarChartData] = useState()
  const [heatmapChartData, setHeatmapChartData] = useState([])
  const [heatmapChartYList, setHeatmapChartYList] = useState([])

  const [heatmapColor, setHeatmapColor] = useState(dataColorInfo.missing)

  useEffect(() => {
    axios
      .get(
        `http://${window.location.hostname}:${PORT}/barchart1?` + Math.random()
      )
      .then((response) => {
        setBarChartData(response.data)
      })
      .catch((error) => {
        console.log(`ERROR - ${error.message}`)
      })

    axios
      .get(
        `http://${window.location.hostname}:${PORT}/heatmapchart?` +
          Math.random()
      )
      .then((response) => {
        setHeatmapChartData(response.data.heatmapList)
        setHeatmapChartYList(response.data.yList)
      })
      .catch((error) => {
        console.log(`ERROR - ${error.message}`)
      })
  }, [])

  return (
    <Box title="data-overview">
      <Legend dataColorInfo={dataColorInfo} />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {Object.entries(dataColorInfo).map(([k, v]) => (
          <HorizontalBarChart
            data={[barChartData?.[k]]}
            colorCode={v}
            onClick={() => setHeatmapColor(v)}
          />
        ))}
      </div>
      <HeatmapChart
        data={heatmapChartData}
        yList={heatmapChartYList}
        columnList={columnList}
        color={heatmapColor}
      />
    </Box>
  )
}
