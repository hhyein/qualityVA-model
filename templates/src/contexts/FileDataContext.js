import axios from 'axios'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import BarChart from '../components/charts/BarChart'
import DensityChart from '../components/charts/DensityChart'
import { PORT } from '../const'

const fetchData = async route => {
  try {
    const res = await axios.get(
      `http://${window.location.hostname}:${PORT}${route}?${Math.random()}`
    )
    return res.data
  } catch (e) {
    console.log(`ERROR - ${e.message}`)
    return undefined
  }
}

const postData = async (route, params, config) => {
  try {
    const res = await axios.post(
      `http://${window.location.hostname}:${PORT}${route}?${Math.random()}`,
      params,
      config
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

  const [file, setFile] = useState()
  const [settingValues, setSettingValues] = useState({
    column: undefined,
    model: undefined,
    eval: undefined,
    dimension: undefined,
  })

  const [settingData, setSettingData] = useState({})
  const [modelOverviewData, setModelOverviewData] = useState({})
  const [modelDetailData, setModelDetailData] = useState({})
  const [actionDetailData, setActionDetailData] = useState({})

  const [selectedModelOverviewTableRow, setSelectedModelOverviewTableRow] =
    useState(0)
  const [
    selectedActionDetailHeatmapIndex,
    setSelectedActionDetailHeatmapIndex,
  ] = useState('')

  const isEmptyData = data => {
    return Object.values(data).some(value => value === undefined)
  }

  const init = useCallback(async () => {
    const data = await fetchData('/')
    setColumnList(data?.columnList ?? [])
  }, [])

  useEffect(() => {
    init()
  }, [init])

  const handleSettingValuesChange = useCallback(async () => {
    if (Object.values(settingValues).some(value => value === undefined)) {
      return
    }
    console.log(settingValues)
    await postData('/setting', settingValues)
  }, [settingValues])

  useEffect(() => {
    handleSettingValuesChange()
  }, [handleSettingValuesChange])

  const updateSetting = useCallback(async () => {
    const { columnList, modelList, evalList, dimensionList } = await fetchData(
      '/setting'
    )
    setSettingData({
      columnList,
      modelList,
      evalList,
      dimensionList,
    })
  }, [])

  const handleDrop = useCallback(
    async files => {
      setFile(files[0])
      var formData = new FormData()
      const config = {
        header: { 'content-type': 'multipart/form-data' },
      }
      formData.append('file', files[0])
      await postData('/fileUpload', formData, config)
      await updateSetting()
    },
    [updateSetting]
  )

  const updateModelDetail = useCallback(async () => {
    const selectedModelOverviewTable = await postData(
      '/selectedModelOverviewTable',
      selectedModelOverviewTableRow
    )
    console.log(selectedModelOverviewTable)

    const lineChart = await fetchData('/lineChart')
    const { treeData, treeLength } = await fetchData('/treeChart')
    const { actionList, actionDetailList, barChartList, densityChartList } =
      await fetchData('/modelDetailTable')

    setModelDetailData({
      lineChart,
      treeChart: { ...treeData, treeLength },
      actionList,
      actionDetailList,
      barChartList: barChartList.map(data => <BarChart data={[data]} />),
      densityChartList: densityChartList.map(data => (
        <DensityChart data={data} />
      )),
    })
  }, [selectedModelOverviewTableRow])

  const updateModelOverview = useCallback(async () => {
    const chartTable = await fetchData('/chartTable')
    setModelOverviewData({ chartTable })
  }, [])

  const updateActionDetail = useCallback(async () => {
    const barChart = await fetchData('/actionDetailBarchart')
    const { heatmapList, heatmapYList } = await fetchData('/heatmapChart')
    const histogramChart = await postData(
      '/histogramChart',
      selectedActionDetailHeatmapIndex
    )
    const scatterChart = await fetchData('/scatterChart')
    setActionDetailData({
      barChart,
      heatmapChart: heatmapList,
      heatmapChartY: heatmapYList,
      histogramChart,
      scatterChart,
    })
  }, [selectedActionDetailHeatmapIndex])

  useEffect(() => {
    if (!file || isEmptyData(settingValues)) {
      return
    }
    updateModelOverview()
    updateModelDetail()
    updateActionDetail()
  }, [
    file,
    updateModelOverview,
    updateModelDetail,
    updateActionDetail,
    settingValues,
  ])

  return (
    <FileDataContext.Provider
      value={{
        dataColumnList,
        file,
        handleDrop,
        settingValues,
        setSettingValues,
        settingData,
        modelOverviewData,
        modelDetailData,
        selectedModelOverviewTableRow,
        setSelectedModelOverviewTableRow,
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
