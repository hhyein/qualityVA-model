import axios from "axios"
import React, { useEffect, useState } from "react"
import { PORT } from "../../../const"
import { Box } from "../../Box"
import HistogramChart from "./HistogramChart"
import ScatterChart from "./ScatterChart"
import Button from "../../Button"

export default function DetailAction() {
  const [dataHistogramChart1, setHistogramChart1] = useState([])
  const [dataClassList, setClassList] = useState([])
  const [dataColorCode, setColorCode] = useState([])
  const [dataScatterChart, setScatterChart] = useState([])
  const [selectedButton, setSelectedButton] = useState('columnData')

  useEffect(() => {
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
  }, [])
  return (
    <Box title="detail-action">
      <div style={{display: 'flex'}}>
        <Button onClick={() => setSelectedButton('columnData')}>
          column data
        </Button>
        <Button onClick={() => setSelectedButton('specificData')}>
          specific data
        </Button>
      </div>
      {selectedButton === 'columnData' ? (
        <HistogramChart data={dataHistogramChart1} />
      ) : (
        <ScatterChart
          data={dataScatterChart}
          method={1}
          dataClassList={dataClassList}
          dataColorCode={dataColorCode}
        />
      )}
    </Box>
  )
}
