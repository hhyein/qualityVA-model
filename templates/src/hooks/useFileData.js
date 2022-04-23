import axios from 'axios'
import { useEffect, useState } from 'react'
import HorizontalBarChart from '../components/charts/HorizontalBarChart'
import HistogramChart from '../components/modules/detailAction/HistogramChart'
import { PORT } from '../const'

export default function useFileData(file) {
  const [lineChart, setLineChart] = useState()
  const [treeChart, setTreeChart] = useState()
  const [actionList, setActionList] = useState()
  const [actionDetailList, setActionDetailList] = useState()
  const [barChartList, setBarChartList] = useState()
  const [histogramChartList, setHistogramChartList] = useState()

  useEffect(() => {
    if (!file) {
      return
    }

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
        setTreeChart({
          ...response.data.treeData,
          treeLength: response.data.treeLength,
        })
      })
      .catch(error => {
        alert(`ERROR - ${error.message}`)
      })

    axios
      .get(
        `http://${window.location.hostname}:${PORT}/modelOverviewTable?` +
          Math.random()
      )
      .then(response => {
        setActionList(response.data.actionList)
        setActionDetailList(response.data.actionDetailList)
        setBarChartList(
          response.data.barChartList.map(data => (
            <HorizontalBarChart data={[data]} colorCode={'steelblue'} />
          ))
        )
        setHistogramChartList(
          response.data.histogramChartList.map(data => (
            <HistogramChart data={[data]} />
          ))
        )
      })
      .catch(error => {
        alert(`ERROR - ${error.message}`)
      })
  }, [file])

  return {
    modelOverviewData: {
      lineChart,
      treeChart,
      actionList,
      actionDetailList,
      barChartList,
      histogramChartList,
    },
  }
}
