import axios from 'axios'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import BarChart from '../components/charts/BarChart'
import DensityChart from '../components/charts/DensityChart'
import { PORT } from '../const'

const fetchData = async (route, params = Math.random()) => {
  try {
    const res = await axios.get(
      `http://${window.location.hostname}:${PORT}${route}?${params}`
    )
    return res.data
  } catch (e) {
    console.log(`ERROR - ${e.message}`)
    return undefined
  }
}

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
  const [
    selectedActionDetailHeatmapIndex,
    setSelectedActionDetailHeatmapIndex,
  ] = useState('')

  const init = useCallback(async () => {
    const data = await fetchData('/')
    setColumnList(data?.columnList)

    const settingData = await fetchData('/setting')
    setSettingColumnList(settingData?.columnList)
    setSettingModelList(settingData?.modelList)
    setSettingEvalList(settingData?.evalList)
  }, [])

  useEffect(() => {
    init()
  }, [init])

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
        selectedActionDetailHeatmapIndex,
        setSelectedActionDetailHeatmapIndex,
        actionDetailData,
        isEmptyData,
      }}
    >
      {children}
    </FileDataContext.Provider>
  )
}

export const useFileData = () => useContext(FileDataContext)
