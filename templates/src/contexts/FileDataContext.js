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

  const [selectedModelOverviewTableRow, setSelectedModelOverviewTableRow] = useState(0)
  const [selectedActionDetailHeatmapIndex, setSelectedActionDetailHeatmapIndex] = useState("")

  const isEmptyData = (data) => {
    return Object.values(data).some((value) => value === undefined)
  }

  const init = useCallback(async () => {
    const data = await fetchData("/")
    setColumnList(data?.columnList ?? [])
  }, [])

  const updateSetting = useCallback(async () => {
    const { columnList, modelList, evalList, dimensionList } = await fetchData("/setting")
    const postSettingValues = await postData("/setting", settingValues)
    console.log(postSettingValues)

    setSettingData({
      columnList,
      modelList,
      evalList,
      dimensionList,
    })
  }, [settingValues])

  useEffect(() => {
    init()
    updateSetting()
  }, [init, updateSetting])

  const updateModelDetail = useCallback(async () => {
    const lineChart = await fetchData("/static/linechart.json")
    const { treeData, treeLength } = await fetchData("/treeChart")
    const { actionList, actionDetailList, barChartList, densityChartList } = await fetchData("/modelDetailTable")
    const selectedModelOverviewTable = await postData("/selectedModelOverviewTable", selectedModelOverviewTableRow)

    setModelDetailData({
      lineChart,
      treeChart: { ...treeData, treeLength },
      actionList,
      actionDetailList,
      barChartList: barChartList.map((data) => <BarChart data={[data]} />),
      densityChartList: densityChartList.map((data) => (
        <DensityChart data={data} />
      )),
    })
  }, [])

  const updateModelOverview = useCallback(async () => {
    const chartTable = await fetchData("/chartTable")
    setModelOverviewData({ chartTable })
  }, [])

  const updateActionDetail = useCallback(async () => {
    const barChart = await fetchData("/actionDetailBarchart")
    const { heatmapList, heatmapYList } = await fetchData("/heatmapChart")
    const histogramChart = await postData("/histogramChart", selectedActionDetailHeatmapIndex)
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
        setFile,
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