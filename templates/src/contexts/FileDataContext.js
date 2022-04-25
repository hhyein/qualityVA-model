import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import BarChart from '../components/charts/BarChart'
import DensityChart from '../components/charts/DensityChart'
import { PORT } from '../const'

const FileDataContext = React.createContext()

export const FileDataProvider = ({ children }) => {
  const [dataColumnList, setColumnList] = useState([])
  const [dataSettingColumnList, setSettingColumnList] = useState([])
  const [dataSettingModelList, setSettingModelList] = useState([])
  const [dataSettingEvalList, setSettingEvalList] = useState([])

  const [file, setFile] = useState()

  const [modelOverviewData, setModelOverviewData] = useState({})
  const [modelDetailData, setModelDetailData] = useState({})
  const [actionDetailData, setActionDetailData] = useState({})

  const [selectedModelDetailTableRow, setSelectedModelDetailTableRow] =
    useState(0)

  useEffect(() => {
    axios
      .get(`http://${window.location.hostname}:${PORT}/?` + Math.random())
      .then(response => {
        setColumnList(response.data.columnList)
      })
      .catch(error => {
        console.log(`ERROR - ${error.message}`)
      })

    axios
      .get(
        `http://${window.location.hostname}:${PORT}/setting?` + Math.random()
      )
      .then(response => {
        setSettingColumnList(response.data.columnList)
        setSettingModelList(response.data.modelList)
        setSettingEvalList(response.data.evalList)
      })
      .catch(error => {
        console.log(`ERROR - ${error.message}`)
      })
  }, [])

  useEffect(() => {
    if (!file) {
      return
    }
    /*------------------------------modelOverview------------------------------*/
    axios
      .get(
        `http://${window.location.hostname}:${PORT}/static/linechart.json?` +
          Math.random()
      )
      .then(response => {
        setModelOverviewData(prev => ({
          ...prev,
          lineChart: response.data,
        }))
      })
      .catch(error => {
        console.log(`ERROR - ${error.message}`)
      })

    axios
      .get(
        `http://${window.location.hostname}:${PORT}/treeChart?` + Math.random()
      )
      .then(response => {
        setModelOverviewData(prev => ({
          ...prev,
          treeChart: response.data,
          treeLength: response.data.treeLength,
        }))
      })
      .catch(error => {
        alert(`ERROR - ${error.message}`)
      })

    axios
      .get(
        `http://${window.location.hostname}:${PORT}/modelOverviewTable?` +
          Math.random()
      )
      .then(
        ({
          data: {
            actionList,
            actionDetailList,
            barChartList,
            histogramChartList,
          },
        }) => {
          setModelOverviewData(prev => ({
            ...prev,
            actionList,
            actionDetailList,
            barChartList: barChartList.map(data => <BarChart />),
            histogramChartList: histogramChartList.map(data => (
              <DensityChart />
            )),
          }))
        }
      )
      .catch(error => {
        alert(`ERROR - ${error.message}`)
      })
    /*-----------------------------------modelDetail----------------------------*/
    axios
      .get(
        `http://${window.location.hostname}:${PORT}/chartTable?` + Math.random()
      )
      .then(response => {
        setModelDetailData(prev => ({
          ...prev,
          chartTable: response.data,
        }))
      })
      .catch(error => {
        console.log(`ERROR - ${error.message}`)
      })
    /*------------------------------actionDetail-------------------------------------*/
    axios
      .get(
        `http://${window.location.hostname}:${PORT}/actionDetailBarchart?` +
          Math.random()
      )
      .then(response => {
        setActionDetailData(prev => ({
          ...prev,
          barChart: response.data,
        }))
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
        setActionDetailData(prev => ({
          ...prev,
          heatmapChart: response.data.heatmapList,
          heatmapChartY: response.data.heatmapYList,
        }))
      })
      .catch(error => {
        console.log(`ERROR - ${error.message}`)
      })
    axios
      .get(
        `http://${window.location.hostname}:${PORT}/histogramChart?` +
          Math.random()
      )
      .then(response => {
        setActionDetailData(prev => ({
          ...prev,
          histogramChart: response.data,
        }))
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
        setActionDetailData(prev => ({
          ...prev,
          scatterChart: response.data,
        }))
      })
      .catch(error => {
        alert(`ERROR - ${error.message}`)
      })
  }, [file])

  const isEmptyData = data => {
    return Object.values(data).some(value => value === undefined)
  }

  return (
    <FileDataContext.Provider
      value={{
        dataColumnList,
        dataSettingColumnList,
        dataSettingModelList,
        dataSettingEvalList,
        file,
        setFile,
        modelOverviewData,
        modelDetailData,
        selectedModelDetailTableRow,
        setSelectedModelDetailTableRow,
        actionDetailData,
        isEmptyData,
      }}
    >
      {children}
    </FileDataContext.Provider>
  )
}

export const useFileData = () => useContext(FileDataContext)
