import React, { useState, useEffect } from 'react'
import axios from 'axios'

import Tablechart from '../components/Tablechart'
import Charttable from '../components/Charttable'

import Treechart from '../components/Treechart'
import Correlationchart from '../components/Correlationchart'
import Parallelchart from '../components/Parallelchart'
import Scatterchart from '../components/Scatterchart'
import ECDFchart from '../components/ECDFchart'
import Spiderchart from '../components/Spiderchart'
import Linechart from '../components/Linechart'

import Barchart1 from '../components/Barchart1'
import Barchart2 from '../components/Barchart2'
import Barchart3 from '../components/Barchart3'
import Boxchart1 from '../components/Boxchart1'
import Boxchart2 from '../components/Boxchart2'
import Densitychart1 from '../components/Densitychart1'
import Densitychart2 from '../components/Densitychart2'
import Histogramchart1 from '../components/Histogramchart1'
import Histogramchart2 from '../components/Histogramchart2'

import { mainLayout2Style } from '../const'
const PORT = 5000

const Home = () => {
  const [data, setData] = useState([])
  const [dataBarchart2, setDataBarchart2] = useState([])
  const [dataCharttable, setDataCharttable] = useState([])
  const [dataHistogramchart1, setHistogramchart1] = useState([])
  const [dataCorrelationchart, setCorrelationchart] = useState([])
  const [dataScatterchart, setScatterchart] = useState([])
  const [dataECDFchart, setECDFchart] = useState([])

  const [data1, setData1] = useState([])
  const [data3, setData3] = useState([])

  useEffect(() => {
    axios
      .get(`http://${window.location.hostname}:${PORT}/static/iris.json?` + Math.random())
      .then(response => { setData(response.data) })
      .catch(error => { alert(`ERROR - ${error.message}`) })

    axios
      .get(`http://${window.location.hostname}:${PORT}/barchart2?` + Math.random())
      .then(response => { setDataBarchart2(response.data) })
      .catch(error => { alert(`ERROR - ${error.message}`) })

    axios
      .get(`http://${window.location.hostname}:${PORT}/charttable?` + Math.random())
      .then(response => { setDataCharttable(response.data) })
      .catch(error => { alert(`ERROR - ${error.message}`) })

    axios
      .get(`http://${window.location.hostname}:${PORT}/correlationchart?` + Math.random())
      .then(response => { setCorrelationchart(response.data) })
      .catch(error => { alert(`ERROR - ${error.message}`) })    

    axios
      .get(`http://${window.location.hostname}:${PORT}/scatterchart?` + Math.random())
      .then(response => { setScatterchart(response.data) })
      .catch(error => { alert(`ERROR - ${error.message}`) })

    axios
      .get(`http://${window.location.hostname}:${PORT}/ECDFchart?` + Math.random())
      .then(response => { setECDFchart(response.data) })
      .catch(error => { alert(`ERROR - ${error.message}`) })

    axios
      .post(`http://${window.location.hostname}:${PORT}/histogramchart1?` + Math.random(), { 'row': 1, 'col': 1 })
      .then(response => { setHistogramchart1(response.data) })
      .catch(error => { alert(`ERROR - ${error.message}`) })



    axios
      .get(`http://${window.location.hostname}:${PORT}/static/barchart1.json?` + Math.random())
      .then(response => { setData1(response.data) })
      .catch(error => { alert(`ERROR - ${error.message}`) })

    axios
    .get(`http://${window.location.hostname}:${PORT}/static/unemployment.json?` + Math.random())
    .then(response => { setData3(response.data) })
    .catch(error => { alert(`ERROR - ${error.message}`) })
  }, [])

  return (
    <div>
      <div className = "main" style = {mainLayout2Style}>
        <div className = "box" style = {{ gridArea: 'title' }}>
          데이터셋 이름 적을 곳
        </div>
        <div className = "box" style = {{ gridArea: 'line-chart' }}>
          <Linechart data = {data} />
        </div>
        <div className = "box" style = {{ gridArea: 'table-chart' }}>
          <Tablechart data = {data} />
        </div>
        <div className = "box" style = {{ gridArea: 'horizontal-bar-chart' }}>
          <div
            className = "divide-same-width"
            style = {{ gridGap: '10px', height: '80px' }}
          >
            <Barchart1 data = {data1} />
            <Barchart2 data = { [dataBarchart2] } />
          </div>
          <div>
            <Charttable
              data = {Array.from({ length: Object.values(dataCharttable).length }, (_, i) => ({
                key: Object.values(dataCharttable)[0][i],
                missing: <Barchart1 data = { [{'Value': Object.values(dataCharttable)[1][i]}] }></Barchart1>,
                outlier: <Barchart1 data = { [{'Value': Object.values(dataCharttable)[2][i]}] }></Barchart1>,
                icons: <Barchart1 data = { [{'Value': Object.values(dataCharttable)[3][i]}] }></Barchart1>
              }))}
              onClick = {(rowIdx, colIdx) =>
                axios
                  .post(`http://${window.location.hostname}:${PORT}/histogramchart1?` + Math.random(), { 'row': rowIdx, 'col': colIdx })
                  .then(response => { setHistogramchart1(response.data) })
                  .catch(error => { alert(`ERROR - ${error.message}`) })
              }
            />
          </div>
        </div>
        <div
          className = "box vertical-align-center"
          style = {{ gridArea: 'tree-chart' }}
        >
          <Treechart />
        </div>
        <div
          className = "divide-same-width box"
          style = {{ gridArea: 'vertical-bar-chart' }}
        >
          <div>
            <Histogramchart1 data = { dataHistogramchart1 }/>
          </div>
          <div>
            <ECDFchart data = {dataECDFchart} />
          </div>
        </div>
        <div className = "box divide-same-width" style = {{ gridArea: 'class-level' }}>
          <Correlationchart data = {dataCorrelationchart}/>
          <Parallelchart data = {data} />
        </div>
        <div className = "divide-same-width box" style = {{ gridArea: 'feature-level' }}>
          <Scatterchart data = {dataScatterchart} method = {1} />
          <Scatterchart data = {dataScatterchart} method = {2} />
        </div>
        <div className = "box" style = {{ gridArea: 'other-chart' }}>
          <Barchart3 />
          <Spiderchart data = {data} />
          <Densitychart2 data = {data} />
          <Boxchart2 data = {data} />
        </div>
      </div>
    </div>
  )
}

export default Home
// bar chart: Error: <rect> attribute width: Expected length, "NaN".
// histogram: Error: <rect> attribute width: A negative value is not valid. ("-1")
