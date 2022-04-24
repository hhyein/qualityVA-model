import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { PORT } from '../../../const'
import { Box } from '../../Box'
import HistogramChart from './HistogramChart'
import ScatterChart from './ScatterChart'
import Action from './Action'
import Legend from '../../Legend'
import HorizontalBarChart from '../../charts/HorizontalBarChart'
import HeatmapChart from '../../charts/HeatmapChart'
import IndexingButtonBox from '../../IndexingButtonBox'

const dataColorInfo = {
  missing: 'steelblue',
  outlier: 'orange',
  incons: 'darkgreen',
}

export default function ActionDetail({ dataColumnList }) {
  const [dataBarChart, setBarChart] = useState()
  const [dataHeatmapChart, setHeatmapChart] = useState()
  const [dataHeatmapChartYList, setHeatmapChartYList] = useState([])
  const [dataHeatmapColor, setHeatmapColor] = useState(dataColorInfo.missing)
  const [dataHistogramChart, setHistogramChart] = useState([])
  const [dataScatterChart, setScatterChart] = useState([])
  const [selectedButton, setSelectedButton] = useState('column data')

  useEffect(() => {
    axios
      .get(
        `http://${window.location.hostname}:${PORT}/actionDetailBarchart?` +
          Math.random()
      )
      .then(response => {
        setBarChart(response.data)
      })
      .catch(error => {
        console.log(`ERROR - ${error.message}`)
      })
    axios
      .get(
        `http://${window.location.hostname}:${PORT}/heatmapChart?` +
          Math.random()
      )
      .then(response => {
        setHeatmapChart(response.data.heatmapList)
        setHeatmapChartYList(response.data.heatmapYList)
      })
      .catch(error => {
        console.log(`ERROR - ${error.message}`)
      })
    axios
      .get(
        `http://${window.location.hostname}:${PORT}/histogramChart?` +
          Math.random(),
      )
      .then(response => {
        setHistogramChart(response.data)
      })
      .catch(error => {
        console.log(`ERROR - ${error.message}`)
      })
    axios
      .get(
        `http://${window.location.hostname}:${PORT}/scatterChart?` +
          Math.random()
      )
      .then(response => {
        setScatterChart(response.data)
      })
      .catch(error => {
        alert(`ERROR - ${error.message}`)
      })
  }, [dataColumnList])
  return (
    <Box title="action-detail" style={{ backgroundColor: 'var(--grey-050)' }}>
      <Legend dataColorInfo={dataColorInfo} />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {Object.entries(dataColorInfo).map(([k, v]) => (
          <HorizontalBarChart
            data={[dataBarChart?.[k]]}
            colorCode={v}
            onClick={() => setHeatmapColor(v)}
          />
        ))}
      </div>
      <HeatmapChart
        data={dataHeatmapChart}
        dataHeatmapChartYList={dataHeatmapChartYList}
        dataColumnList={dataColumnList}
        colorCode={dataHeatmapColor}
      />
      <IndexingButtonBox
        style={{ margin: '5px 0', height: '47%' }}
        componentInfo={{
          'column data': <HistogramChart data={dataHistogramChart} />,
          'specific data': <ScatterChart data={dataScatterChart} method={1} />,
        }}
      />
      <Action />
    </Box>
  )
}
