import React, { useState, useEffect } from "react"
import axios from "axios"
import Input from "../components/Input"
import Button from "../components/Button"
import NL4DV from "../components/NL4DV"
import Histogramchart1 from "../components/Histogramchart1"
import Scatterchart from "../components/Scatterchart"
import ECDFchart from "../components/ECDFchart"
import Instance from "../components/Instance"
import Class from "../components/Class"
import Treetable from "../components/Treetable"

import { mainLayout2Style } from "../const"
import { Box } from "../components/Box"
import DataOverview from "../components/modules/dataOverview"
import DataUpload from "../components/modules/dataUpload"
import Setting from "../components/modules/setting"
import ModelOverview from "../components/modules/modelOverview"

const PORT = 5000

const Home = () => {
  const [dataColumnList, setColumnList] = useState([])
  const [dataClassList, setClassList] = useState([])
  const [dataColorCode, setColorCode] = useState([])
  const [dataTypeList, setTypeList] = useState([])
  const [dataEvalList, setEvalList] = useState([])

  const [dataHistogramchart1, setHistogramchart1] = useState([])
  const [dataScatterchart, setScatterchart] = useState([])
  const [dataECDFchart, setECDFchart] = useState([])

  const [dataQuery, setQuery] = useState("")
  const [dataNL4DV, setNL4DV] = useState()
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
        alert(`ERROR - ${error.message}`)
      })
  }

  useEffect(() => {
    axios
      .get(`http://${window.location.hostname}:${PORT}/?` + Math.random())
      .then((response) => {
        setColumnList(response.data.columnList)
        setClassList(response.data.classList)
        setColorCode(
          Array.from(
            { length: Object(response.data.classList).length },
            () => "#" + Math.round(Math.random() * 0xffffff).toString(16)
          )
        )
      })
      .catch((error) => {
        alert(`ERROR - ${error.message}`)
      })

    axios
      .get(
        `http://${window.location.hostname}:${PORT}/setting?` + Math.random()
      )
      .then((response) => {
        setTypeList(response.data.typeList)
        setEvalList(response.data.evalList)
      })
      .catch((error) => {
        alert(`ERROR - ${error.message}`)
      })

    axios
      .get(
        `http://${window.location.hostname}:${PORT}/scatterchart?` +
          Math.random()
      )
      .then((response) => {
        setScatterchart(response.data)
      })
      .catch((error) => {
        alert(`ERROR - ${error.message}`)
      })
    axios
      .get(
        `http://${window.location.hostname}:${PORT}/ECDFchart?` + Math.random()
      )
      .then((response) => {
        setECDFchart(response.data)
      })
      .catch((error) => {
        alert(`ERROR - ${error.message}`)
      })

    axios
      .post(
        `http://${window.location.hostname}:${PORT}/histogramchart1?` +
          Math.random(),
        { row: 1, col: 1 }
      )
      .then((response) => {
        setHistogramchart1(response.data)
      })
      .catch((error) => {
        alert(`ERROR - ${error.message}`)
      })
  }, [])

  return (
    <div>
      <div className="main" style={mainLayout2Style}>
        <DataUpload />
        <Setting dataTypeList={dataTypeList} dataEvalList={dataEvalList} />
        <DataOverview columnList={dataColumnList} />
        <ModelOverview />
        <Box
          title="instance-level"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridGap: "10px",
          }}
        >
          <Histogramchart1 data={dataHistogramchart1} />
          <ECDFchart data={dataECDFchart} />
          <Box
            style={{
              display: "grid",
              overflow: "visible",
              gridGap: "5px",
            }}
          >
            <Instance dataTypeList={dataTypeList} />
          </Box>
        </Box>
        <Box
          title="class-level"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridGap: "10px",
          }}
        >
          <Scatterchart
            data={dataScatterchart}
            method={1}
            dataClassList={dataClassList}
            dataColorCode={dataColorCode}
          />
          <Scatterchart
            data={dataScatterchart}
            method={2}
            dataClassList={dataClassList}
            dataColorCode={dataColorCode}
          />
          <Box
            style={{
              display: "grid",
              overflow: "visible",
              gridGap: "5px",
            }}
          >
            <Class dataTypeList={dataTypeList} />
          </Box>
        </Box>
        <Box title="tree-chart" style={{ display: "flex", overflow: "auto" }}>
          <Treetable />
        </Box>
        <Box title="model" style={{ overflow: "auto" }}></Box>
        <Box title="visualization">
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
      </div>
    </div>
  )
}

export default Home
// bar chart: Error: <rect> attribute width: Expected length, "NaN".
// histogram: Error: <rect> attribute width: A negative value is not valid. ("-1")
