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
        `http://${window.location.hostname}:${PORT}/treeChart?` +
          Math.random()
      )
      .then(response => {
        setTreeChart(response.data.treeData)
        setTreeLength(response.data.treeLength)
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
        gridTemplateRows: 'auto 1fr 40px 160px',
      }}
    >
      <Legend dataColorInfo={dataColorInfo} />
      <LineChart data={dataLineChart} />
      <HorizontalTreeChart data={[dataTreeChart]} />
      <div style={{ overflow: 'auto' }}>
        <ModelOverviewTable
          data={[
            {
              chart1: 'eee',
              chart2: 'eee',
              chart3: 'eee',
            },
            {
              chart1: 'eee',
              chart2: 'eee',
              chart3: 'eee',
            },
            {
              chart1: 'eee',
              chart2: 'eee',
              chart3: 'eee',
            },
            {
              chart1: 'eee',
              chart2: 'eee',
              chart3: 'eee',
            },
            {
              chart1: 'eee',
              chart2: 'eee',
              chart3: 'eee',
            },
            {
              chart1: 'eee',
              chart2: 'eee',
              chart3: 'eee',
            },
          ]}
        />
      </div>
    </Box>
  )
}
