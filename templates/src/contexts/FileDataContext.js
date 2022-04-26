import axios from "axios"
import React, { useCallback, useContext, useEffect, useState } from "react"
import BarChart from "../components/charts/BarChart"
import DensityChart from "../components/charts/DensityChart"
import { PORT } from "../const"

const fetchData = async (route) => {
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

const postData = async (route, params) => {
  try {
    const res = await axios.post(
      `http://${window.location.hostname}:${PORT}${route}?${Math.random()}`,
      params
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
  const [dataSettingDimensionList, setSettingDimensionList] = useState([])

  const [file, setFile] = useState()

  const [modelOverviewData, setModelOverviewData] = useState({})
  const [modelDetailData, setModelDetailData] = useState({})
  const [actionDetailData, setActionDetailData] = useState({})

  const [
    selectedModelDetailTableRow,
    setSelectedModelDetailTableRow,
  ] = useState(0)
  const [
    selectedActionDetailHeatmapIndex,
    setSelectedActionDetailHeatmapIndex,
  ] = useState("")

  const init = useCallback(async () => {
    const data = await fetchData("/")
    setColumnList(data?.columnList ?? [])

    const settingData = await fetchData("/setting")
    setSettingColumnList(settingData?.columnList ?? [])
    setSettingModelList(settingData?.modelList ?? [])
    setSettingEvalList(settingData?.evalList ?? [])
    setSettingDimensionList(settingData?.dimensionList ?? [])
  }, [])

  useEffect(() => {
    init()
  }, [init])

  const updateModelOverview = useCallback(async () => {
    const lineChart = await fetchData("/static/linechart.json")
    const { treeData, treeLength } = await fetchData("/treeChart")
    const { actionList, actionDetailList, barChartList, densityChartList } =
      await fetchData("/modelOverviewTable")

    // have to develop
    const selectedModelDetailTable = await postData(
      "/selectedModelDetailTable",
      selectedModelDetailTableRow
    )

    setModelOverviewData({
      lineChart,
      treeChart: { ...treeData, treeLength },
      actionList,
      actionDetailList,
      barChartList: barChartList.map((data) => <BarChart data={[data]} />),
      densityChartList: densityChartList.map((data) => <DensityChart data={data} />),
    })
  }, [])

  const updateModelDetail = useCallback(async () => {
    const chartTable = await fetchData("/chartTable")
    setModelDetailData({ chartTable })
  }, [])

  const updateActionDetail = useCallback(async () => {
    const barChart = await fetchData("/actionDetailBarchart")
    const { heatmapList, heatmapYList } = await fetchData("/heatmapChart")
    const histogramChart = await postData(
      "/histogramChart",
      selectedActionDetailHeatmapIndex
    )
    const scatterChart = await fetchData("/scatterChart")
    setActionDetailData({
      barChart,
      heatmapChart: heatmapList,
      heatmapChartY: heatmapYList,
      histogramChart,
      scatterChart,
    })
  }, [selectedActionDetailHeatmapIndex])

  useEffect(() => {
    if (!file) {
      return
    }
    updateModelOverview()
    updateModelDetail()
    updateActionDetail()
  }, [file, updateModelOverview, updateModelDetail, updateActionDetail])

  const isEmptyData = (data) => {
    return Object.values(data).some((value) => value === undefined)
  }

  return (
    <FileDataContext.Provider
      value={{
        dataColumnList,
        dataSettingColumnList,
        dataSettingModelList,
        dataSettingEvalList,
        dataSettingDimensionList,
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
