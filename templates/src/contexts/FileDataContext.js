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
    purpose: undefined,
    column: undefined,
    model: undefined,
    eval: undefined,
    dimension: undefined,
  })

  const [purposeList, setPurposeList] = useState()
  const [settingData, setSettingData] = useState({})
  const [modelOverviewData, setModelOverviewData] = useState({})
  const [modelDetailData, setModelDetailData] = useState({})
  const [actionDetailData, setActionDetailData] = useState({})

  const [selectedModelOverviewTableRow, setSelectedModelOverviewTableRow] =
    useState()
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
    await postData('/setting', settingValues)
  }, [settingValues])

  useEffect(() => {
    handleSettingValuesChange()
  }, [handleSettingValuesChange])

  const updatePurposeList = useCallback(async () => {
    const { purposeList } = await fetchData('/setting')

    setPurposeList(purposeList)
  }, [])

  const handlePurposeChange = useCallback(async () => {
    if (!settingValues.purpose) {
      return
    }
    await postData('/setting', settingValues)
    const { columnList, modelList, evalList, dimensionList } = await fetchData(
      '/setting'
    )
    setSettingData({
      columnList,
      modelList,
      evalList,
      dimensionList,
    })
  }, [settingValues.purpose])

  const handleDrop = useCallback(
    async files => {
      setFile(files[0])
      var formData = new FormData()
      const config = {
        header: { 'content-type': 'multipart/form-data' },
      }
      formData.append('file', files[0])
      await postData('/fileUpload', formData, config)
      await updatePurposeList()
    },
    [updatePurposeList]
  )

  const updateModelDetail = useCallback(async () => {
    if (selectedModelOverviewTableRow === undefined) {
      return
    }
    const { key, combination, combinationDetail } =
      selectedModelOverviewTableRow
    await postData('/selectedModelOverviewTable', {
      key,
      combination,
      combinationDetail,
    })

    const lineChart = await fetchData('/lineChart')
    const treeChart = await fetchData('/treeChart')
    const {
      currentCnt,
      actionList,
      actionDetailList,
      barChartList,
      densityChartList,
    } = await fetchData('/modelDetailTable')

    setModelDetailData({
      lineChart,
      treeChart,
      currentCnt,
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
    handlePurposeChange()
  }, [handlePurposeChange])

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
        purposeList,
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
