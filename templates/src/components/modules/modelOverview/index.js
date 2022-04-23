import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { PORT } from '../../../const'
import { Box } from '../../Box'
import Legend from '../../Legend'
import LineChart from './LineChart'
import HorizontalTreeChart from './HorizontalTreeChart'
import ModelOverviewTable from './ModelOverviewTable'

const dataColorInfo = {
  lr: '#eb3477',
  knn: '#8934eb',
  nb: '#4ceb34',
}

export default function ModelOverview() {
  const [dataLineChart, setLineChart] = useState()
  const [dataTreeChart, setTreeChart] = useState([])
  const [dataTreeLength, setTreeLength] = useState([])
  const [dataActionList, setActionList] = useState([])
  const [dataActionDetailList, setActionDetailList] = useState([])
  const [dataBarChartList, setbarChartList] = useState([])
  const [dataHistogramChartList, setHistogramChartList] = useState([])

  useEffect(() => {
    axios
      .get(
        `http://${window.location.hostname}:${PORT}/static/linechart.json?` +
          Math.random()
      )
      .then(response => {
        setLineChart(response.data)
      })
      .catch(error => {
        console.log(`ERROR - ${error.message}`)
      })
    axios
      .get(
        `http://${window.location.hostname}:${PORT}/treeChart?` + Math.random()
      )
      .then(response => {
        setTreeChart(response.data.treeData)
        setTreeLength(response.data.treeLength)
      })
      .catch(error => {
        alert(`ERROR - ${error.message}`)
      })
    axios
      .get(
        `http://${window.location.hostname}:${PORT}/modelOverviewTable?` + Math.random()
      )
      .then(response => {
        setActionList(response.data.actionList)
        setActionDetailList(response.data.actionDetailList)
        setbarChartList(response.data.barChartList)
        setHistogramChartList(response.data.histogramChartList)
      })
      .catch(error => {
        alert(`ERROR - ${error.message}`)
      })
  }, [])

  return (
    <Box
      title="model-overview"
      style={{
        display: 'grid',
        gridTemplateRows: 'auto 1fr 200px',
      }}
    >
      <Legend dataColorInfo={dataColorInfo} />
      <LineChart data={dataLineChart} />
      <div style={{ overflow: 'auto' }}>
        <ModelOverviewTable
          thead={<HorizontalTreeChart data={[dataTreeChart]} />}
          theadColSpan={dataTreeLength}
          data={[
            {
              chart1: 'eee',
              chart2: 'eee',
              chart3: 'eee',
              chart4: 'eee',
              chart5: 'eee',
              chart6: 'eee',
            },
            {
              chart1: 'eee',
              chart2: 'eee',
              chart3: 'eee',
              chart4: 'eee',
              chart5: 'eee',
              chart6: 'eee',
            },
            {
              chart1: 'eee',
              chart2: 'eee',
              chart3: 'eee',
              chart4: 'eee',
              chart5: 'eee',
              chart6: 'eee',
            },
            {
              chart1: 'eee',
              chart2: 'eee',
              chart3: 'eee',
              chart4: 'eee',
              chart5: 'eee',
              chart6: 'eee',
            },
            {
              chart1: 'eee',
              chart2: 'eee',
              chart3: 'eee',
              chart4: 'eee',
              chart5: 'eee',
              chart6: 'eee',
            },
          ]}
        />
      </div>
    </Box>
  )
}
