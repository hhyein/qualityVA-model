import React, { useState, useEffect } from "react"
import axios from "axios"

import Tablechart from "../components/Tablechart"
import NL4DV from "../components/NL4DV"

import Charttable from "../components/Charttable"
import Barchart1 from "../components/Barchart1"
import Barchart2 from "../components/Barchart2"
import Boxchart1 from "../components/Boxchart1"
import Densitychart1 from "../components/Densitychart1"
import Treechart from "../components/Treechart"
import Histogramchart1 from "../components/Histogramchart1"
import Correlationchart from "../components/Correlationchart"
import Parallelchart from "../components/Parallelchart"
import Scatterchart from "../components/Scatterchart"
import ECDFchart from "../components/ECDFchart"
import Dropdown from "../components/Dropdown"

import { mainLayout2Style } from "../const"
import { Box } from "../components/Box"
const PORT = 5000

const Home = () => {
  const [data, setData] = useState([])
  const [dataTreechart, setDataTreechart] = useState([])
  const [dataModelList, setModelList] = useState([])

  const [dataFileName, setFileName] = useState([])
  const [dataClassName, setClassName] = useState([])
  const [dataClassList, setClassList] = useState([])

  const [dataBarchart, setDataBarchart] = useState([])
  const [dataCharttable, setDataCharttable] = useState([])
  const [dataHistogramchart1, setHistogramchart1] = useState([])
  const [dataCorrelationchart, setCorrelationchart] = useState([])
  const [dataScatterchart, setScatterchart] = useState([])
  const [dataECDFchart, setECDFchart] = useState([])

  const [data1, setData1] = useState([])

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
      .get(
        `http://${window.location.hostname}:${PORT}/static/iris.json?` +
          Math.random()
      )
      .then((response) => {
        setData(response.data)
      })
      .catch((error) => {
        alert(`ERROR - ${error.message}`)
      })
    axios
      .get(
        `http://${window.location.hostname}:${PORT}/static/treeData.json?` +
          Math.random()
      )
      .then((response) => {
        setDataTreechart(response.data)
      })
      .catch((error) => {
        alert(`ERROR - ${error.message}`)
      })
    axios
      .get(
        `http://${window.location.hostname}:${PORT}/static/modelData.json?` +
          Math.random()
      )
      .then((response) => {
        setModelList(response.data)
      })
      .catch((error) => {
        alert(`ERROR - ${error.message}`)
      })
    axios
      .get(`http://${window.location.hostname}:${PORT}/?` + Math.random())
      .then((response) => {
        setFileName(response.data.fileName)
        setClassName(response.data.className)
        setClassList(response.data.classList)
      })
      .catch((error) => {
        alert(`ERROR - ${error.message}`)
      })

    axios
      .get(
        `http://${window.location.hostname}:${PORT}/barchart?` + Math.random()
      )
      .then((response) => {
        setDataBarchart(response.data)
      })
      .catch((error) => {
        alert(`ERROR - ${error.message}`)
      })
    axios
      .get(
        `http://${window.location.hostname}:${PORT}/charttable?` + Math.random()
      )
      .then((response) => {
        setDataCharttable(response.data)
      })
      .catch((error) => {
        alert(`ERROR - ${error.message}`)
      })
    axios
      .get(
        `http://${window.location.hostname}:${PORT}/correlationchart?` +
          Math.random()
      )
      .then((response) => {
        setCorrelationchart(response.data)
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

    axios
      .get(
        `http://${window.location.hostname}:${PORT}/static/barchart1.json?` +
          Math.random()
      )
      .then((response) => {
        setData1(response.data)
      })
      .catch((error) => {
        alert(`ERROR - ${error.message}`)
      })
  }, [])

  return (
    <div>
      <div className="main" style={mainLayout2Style}>
        <Box title="dataset">fileName: {dataFileName}.csv</Box>
        <Box
          title="setting"
          style={{
            display: "grid",
            overflow: "visible",
            gridGap: "5px",
          }}
        >
          <Dropdown />
        </Box>
        <Box title="table-chart" style={{ overflow: "auto" }}>
          <Tablechart data={data} />
        </Box>
        <Box title="visualization">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={dataQuery}
              onChange={handleChange}
              placeholder="type your query here..."
            />
            <button type="submit">submit</button>
          </form>
          <NL4DV spec={dataNL4DV} />
        </Box>
        <Box title="overview" style={{ overflow: "auto" }}>
          <Barchart1 data={data1} />
          <Barchart2 data={[dataBarchart]} />
          <Charttable
            data={Array.from(
              { length: Object(dataCharttable.columnList).length },
              (_, i) => ({
                key: Object.values(dataCharttable)[0][i],
                missing: (
                  <Barchart1
                    data={[{ Value: Object.values(dataCharttable)[1][i] }]}
                  ></Barchart1>
                ),
                outlier: (
                  <Barchart1
                    data={[{ Value: Object.values(dataCharttable)[2][i] }]}
                  ></Barchart1>
                ),
                icons: (
                  <Barchart1
                    data={[{ Value: Object.values(dataCharttable)[3][i] }]}
                  ></Barchart1>
                ),
                quantile: (
                  <Boxchart1
                    data={[{ Value: Object.values(dataCharttable)[4][i] }]}
                  ></Boxchart1>
                ),
                descriptive: (
                  <Densitychart1
                    data={[{ Value: Object.values(dataCharttable)[5][i] }]}
                  ></Densitychart1>
                ),
              })
            )}
            onClick={(rowIdx, colIdx) =>
              axios
                .post(
                  `http://${window.location.hostname}:${PORT}/histogramchart1?` +
                    Math.random(),
                  { row: rowIdx, col: colIdx }
                )
                .then((response) => {
                  setHistogramchart1(response.data)
                })
                .catch((error) => {
                  alert(`ERROR - ${error.message}`)
                })
            }
          />
        </Box>
        <Box
          title="class-level"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridGap: "10px",
          }}
        >
          <Scatterchart data={dataScatterchart} method={1} />
          {/* <Parallelchart data={data} /> */}
          <Scatterchart
            data={dataScatterchart}
            dataClassList={dataClassList}
            method={2}
          />
        </Box>
        <Box
          title="instance-level"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridGap: "10px",
          }}
        >
          <Histogramchart1 data={dataHistogramchart1} />
          <Correlationchart data={dataCorrelationchart} />
          <ECDFchart data={dataECDFchart} />
        </Box>
        <Box
          title="tree-chart"
          style={{ display: "flex", alignItems: "center", overflow: "auto" }}
        >
          <Treechart data={[dataTreechart]} />
        </Box>
        <Box title="model" style={{ overflow: "auto" }}>
          <Tablechart data={dataModelList} />
        </Box>
      </div>
    </div>
  )
}

export default Home
// bar chart: Error: <rect> attribute width: Expected length, "NaN".
// histogram: Error: <rect> attribute width: A negative value is not valid. ("-1")
