import React, { useState, useEffect } from 'react'
import axios from 'axios'

import Tablechart from '../components/Tablechart'
import Linechart from '../components/Linechart'
import NL4DV from '../components/NL4DV'

import Charttable from '../components/Charttable'
import Barchart1 from '../components/Barchart1'
import Barchart2 from '../components/Barchart2'
import Boxchart1 from '../components/Boxchart1'
import Densitychart1 from '../components/Densitychart1'
import Treechart from '../components/Treechart'
import Histogramchart1 from '../components/Histogramchart1'
import Correlationchart from '../components/Correlationchart'
import Parallelchart from '../components/Parallelchart'
import Scatterchart from '../components/Scatterchart'
import ECDFchart from '../components/ECDFchart'
import Dropdown from '../components/Dropdown'

import Barchart3 from '../components/Barchart3'
import Spiderchart from '../components/Spiderchart'
import Densitychart2 from '../components/Densitychart2'
import Boxchart2 from '../components/Boxchart2'

import { mainLayout2Style } from '../const'
import { Box } from '../components/Box'
const PORT = 5000

const Home = () => {
  const [data, setData] = useState([])
  const [dataTreechart, setDataTreechart] = useState([])
  const [dataClassName, setClassName] = useState([])
  const [dataClassList, setClassList] = useState([])
  const [dataModelList, setModelList] = useState([])
  const [dataOutput1List, setOutput1List] = useState([])
  const [dataOutput2List, setOutput2List] = useState([])
  const [dataOutput3List, setOutput3List] = useState([])

  const [dataBarchart, setDataBarchart] = useState([])
  const [dataCharttable, setDataCharttable] = useState([])
  const [dataHistogramchart1, setHistogramchart1] = useState([])
  const [dataCorrelationchart, setCorrelationchart] = useState([])
  const [dataScatterchart, setScatterchart] = useState([])
  const [dataECDFchart, setECDFchart] = useState([])

  const [data1, setData1] = useState([])

  const [dataQuery, setQuery] = useState('')
  const [dataNL4DV, setNL4DV] = useState()
  const handleChange = ({ target: { value } }) => setQuery(value)
  const handleSubmit = e => {
    e.preventDefault()
    axios
      .post(`http://${window.location.hostname}:${PORT}/query?`, dataQuery)
      .then(response => {
        setNL4DV(response.data)
      })
      .catch(error => {
        alert(`ERROR - ${error.message}`)
      })
  }

  useEffect(() => {
    axios
      .get(`http://${window.location.hostname}:${PORT}/static/iris.json?`)
      .then(response => {
        setData(response.data)
      })
      .catch(error => {
        alert(`ERROR - ${error.message}`)
      })
    axios
      .get(`http://${window.location.hostname}:${PORT}/static/treeData.json?`)
      .then(response => {
        setDataTreechart(response.data)
      })
      .catch(error => {
        alert(`ERROR - ${error.message}`)
      })
    axios
      .get(`http://${window.location.hostname}:${PORT}/?`)
      .then(response => {
        setClassName(response.data.className)
        setClassList(response.data.classList)
        setModelList(response.data.modelList)
        setOutput1List(response.data.dataOutput1List)
        setOutput2List(response.data.dataOutput2List)
        setOutput3List(response.data.dataOutput3List)
      })
      .catch(error => {
        alert(`ERROR - ${error.message}`)
      })

    axios
      .get(`http://${window.location.hostname}:${PORT}/barchart?`)
      .then(response => {
        setDataBarchart(response.data)
      })
      .catch(error => {
        alert(`ERROR - ${error.message}`)
      })
    axios
      .get(`http://${window.location.hostname}:${PORT}/charttable?`)
      .then(response => {
        setDataCharttable(response.data)
      })
      .catch(error => {
        alert(`ERROR - ${error.message}`)
      })
    axios
      .get(`http://${window.location.hostname}:${PORT}/correlationchart?`)
      .then(response => {
        setCorrelationchart(response.data)
      })
      .catch(error => {
        alert(`ERROR - ${error.message}`)
      })
    axios
      .get(`http://${window.location.hostname}:${PORT}/scatterchart?`)
      .then(response => {
        setScatterchart(response.data)
      })
      .catch(error => {
        alert(`ERROR - ${error.message}`)
      })
    axios
      .get(`http://${window.location.hostname}:${PORT}/ECDFchart?`)
      .then(response => {
        setECDFchart(response.data)
      })
      .catch(error => {
        alert(`ERROR - ${error.message}`)
      })
    axios
      .post(`http://${window.location.hostname}:${PORT}/histogramchart1?`, {
        row: 1,
        col: 1,
      })
      .then(response => {
        setHistogramchart1(response.data)
      })
      .catch(error => {
        alert(`ERROR - ${error.message}`)
      })

    axios
      .get(`http://${window.location.hostname}:${PORT}/static/barchart1.json?`)
      .then(response => {
        setData1(response.data)
      })
      .catch(error => {
        alert(`ERROR - ${error.message}`)
      })
  }, [])

  return (
    <div>
      <div className="main" style={mainLayout2Style}>
        <Box title="dataset">dataset</Box>
        <Box title="table-chart" style={{ overflow: 'auto' }}>
          <Tablechart data={data} />
        </Box>
        <Box title="line-chart">
          <Linechart data={data} />
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

        <Box title="chart-table-top-left">
          <Barchart1 data={data1} />
        </Box>
        <Box title="chart-table-top-right">
          <Barchart2 data={[dataBarchart]} />
        </Box>
        <Box title="chart-table" style={{ overflow: 'auto' }}>
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
                .then(response => {
                  setHistogramchart1(response.data)
                })
                .catch(error => {
                  alert(`ERROR - ${error.message}`)
                })
            }
          />
        </Box>
        <Box
          title="tree-chart"
          style={{ display: 'flex', alignItems: 'center', overflow: 'auto' }}
        >
          <Treechart data={[dataTreechart]} />
        </Box>
        <Box
          title="center-charts"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gridGap: '10px',
          }}
        >
          <Histogramchart1 data={dataHistogramchart1} />
          <Correlationchart data={dataCorrelationchart} />
          <Scatterchart data={dataScatterchart} method={1} />
          <ECDFchart data={dataECDFchart} />
          <Parallelchart data={data} />
          <Scatterchart
            data={dataScatterchart}
            dataClassList={dataClassList}
            method={2}
          />
        </Box>
        <Box title="interaction" style={{ overflow: 'visible' }}>
          <Dropdown />
        </Box>
        <Box title="right-charts">
          <Barchart3 />
          <Spiderchart data={data} />
          <Densitychart2 data={data} />
          <Boxchart2
            data={data}
            dataClassName={dataClassName}
            dataClassList={dataClassList}
          />
        </Box>
      </div>
    </div>
  )
}

export default Home
// bar chart: Error: <rect> attribute width: Expected length, "NaN".
// histogram: Error: <rect> attribute width: A negative value is not valid. ("-1")
