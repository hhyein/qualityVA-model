import axios from "axios"
import React, { useEffect, useState } from "react"
import { PORT } from "../../../const"
import { Box } from "../../Box"
import HistogramChart from "./HistogramChart"
import ScatterChart from "./ScatterChart"
import Action from "./Action"
import Button from "../../Button"
import Legend from "../../Legend"
import HorizontalBarChart from "../../charts/HorizontalBarChart"
import HeatmapChart from "../../charts/HeatmapChart"

const selectedButtonStyle = {
  borderRadius: "4px 4px 0 0",
  backgroundColor: "white",
  borderBottomWidth: 0,
}

const unSelectedButtonStyle = {
  borderRadius: "4px 4px 0 0",
  backgroundColor: "transparent",
  borderWidth: "0 0 1px 0",
}

const buttonLabels = ["column data", "specific data"]

const dataColorInfo = {
  missing: "steelblue",
  outlier: "orange",
  incons: "darkgreen",
}

export default function DetailAction({ columnList }) {
  const [barChartData, setBarChartData] = useState()
  const [heatmapChartData, setHeatmapChartData] = useState([])
  const [heatmapChartYList, setHeatmapChartYList] = useState([])
  const [heatmapColor, setHeatmapColor] = useState(dataColorInfo.missing)

  const [dataHistogramChart1, setHistogramChart1] = useState([])
  const [dataClassList, setClassList] = useState([])
  const [dataColorCode, setColorCode] = useState([])
  const [dataScatterChart, setScatterChart] = useState([])
  const [selectedButton, setSelectedButton] = useState("column data")

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
    axios
      .post(
        `http://${window.location.hostname}:${PORT}/histogramchart1?` +
          Math.random(),
        { row: 1, col: 1 }
      )
      .then((response) => {
        setHistogramChart1(response.data)
      })
      .catch((error) => {
        console.log(`ERROR - ${error.message}`)
      })
    axios
      .get(`http://${window.location.hostname}:${PORT}/?` + Math.random())
      .then((response) => {
        setClassList(response.data.classList)
        setColorCode(
          Array.from(
            { length: Object(response.data.classList).length },
            () => "#" + Math.round(Math.random() * 0xffffff).toString(16)
          )
        )
      })
      .catch((error) => {
        console.log(`ERROR - ${error.message}`)
      })
    axios
      .get(
        `http://${window.location.hostname}:${PORT}/scatterchart?` +
          Math.random()
      )
      .then((response) => {
        setScatterChart(response.data)
      })
      .catch((error) => {
        alert(`ERROR - ${error.message}`)
      })
  }, [columnList])
  return (
    <Box title="detail-action" style={{ backgroundColor: "var(--grey-050)" }}>
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
        colorCode={heatmapColor}
      />
      <div style={{ display: "flex", marginTop: "5px" }}>
        {buttonLabels.map((label) => (
          <Button
            onClick={() => setSelectedButton(label)}
            style={
              selectedButton === label
                ? selectedButtonStyle
                : unSelectedButtonStyle
            }
          >
            {label}
          </Button>
        ))}
      </div>
      <div
        style={{
          border: "1px solid var(--grey-100)",
          borderTopWidth: 0,
          background: "white",
          height: "40%",
          marginBottom: "5px"
        }}
      >
        {selectedButton === "column data" ? (
          <HistogramChart data={dataHistogramChart1} />
        ) : (
          <ScatterChart
            data={dataScatterChart}
            method={1}
            dataClassList={dataClassList}
            dataColorCode={dataColorCode}
          />
        )}
      </div>
      <Action />
    </Box>
  )
}