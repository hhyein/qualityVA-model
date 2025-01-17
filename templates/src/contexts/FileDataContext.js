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

export const postData = async (route, params, config) => {
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
    eval: undefined
  })

  const [purposeList, setPurposeList] = useState()
  const [settingData, setSettingData] = useState({})
  const [modelOverviewData, setModelOverviewData] = useState({})
  const [modelDetailData, setModelDetailData] = useState({})
  const [actionDetailData, setActionDetailData] = useState({})
  const [modelOverviewTableSortingInfo, setModelOverviewTableSortingInfo] =
    useState({})
  const [selectedModelOverviewTableRow, setSelectedModelOverviewTableRow] =
    useState()
  const [
    selectedActionDetailHeatmapIndex,
    setSelectedActionDetailHeatmapIndex,
  ] = useState('')

  const isEmptyData = data => {
    return Object.values(data).some(value => value === undefined)
  }

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
    setModelOverviewTableSortingInfo(prev => ({
      ...prev,
      isAscending: settingValues.purpose.label === 'prediction',
    }))
    await postData('/setting', settingValues)
    const { columnList, modelList, evalList } = await fetchData(
      '/setting'
    )
    setSettingData({
      columnList,
      modelList,
      evalList,
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
      const data = await postData('/fileUpload', formData, config)
      setColumnList(data?.columnList ?? [])
      await updatePurposeList()
    },
    [updatePurposeList]
  )

  const updateModelDetail = useCallback(async () => {
    if (selectedModelOverviewTableRow === undefined) {
      return
    }
    await postData('/selectedModelOverviewTable', selectedModelOverviewTableRow)

    const lineChart = await fetchData('/lineChart')
    const treeChart = await fetchData('/treeChart')
    const {
      currentCnt,
      actionList,
      actionDetailList,
      barChartList,
      densityChartList,
    } = await fetchData('/modelDetailTable')

    const densityChartNum = [["(S) 4.114", "(K) 22.13"], ["(S) 3.931", "(K) 21.06"], ["(S) 3.418", "(K) 21.83"], ["(S) 3.430", "(K) 21.71"]]

    setModelDetailData({
      lineChart,
      treeChart,
      currentCnt,
      actionList,
      actionDetailList,
      barChartList: barChartList.map(data => <BarChart data={[data]} />),
      densityChartList: densityChartList.map((data, i) => (
        <DensityChart data={data} densityChartNum = {densityChartNum[i]} />
      )),
    })
  }, [selectedModelOverviewTableRow])

  const updateModelOverview = useCallback(async () => {
    const chartTable = await fetchData('/chartTable')
    setModelOverviewTableSortingInfo(prev => ({
      ...prev,
      column: chartTable.inputEvalList[0],
    }))
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
        modelOverviewTableSortingInfo,
        setModelOverviewTableSortingInfo,
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
