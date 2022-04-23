import React, { useState, useEffect } from "react"
import axios from "axios"

import { mainLayout2Style } from "../const"
import FileUpload from "../components/modules/fileUpload"
import Setting from "../components/modules/setting"
import ModelOverview from "../components/modules/modelOverview"
import Visualization from "../components/modules/visualization"
import DetailAction from "../components/modules/detailAction"
import ModelDetail from "../components/modules/modelDetail"

const PORT = 5000

const Home = () => {
  const [dataColumnList, setColumnList] = useState([])
  const [dataSettingColumnList, setSettingColumnList] = useState([])
  const [dataSettingModelList, setSettingModelList] = useState([])
  const [dataSettingEvalList, setSettingEvalList] = useState([])

  useEffect(() => {
    axios
      .get(`http://${window.location.hostname}:${PORT}/?` + Math.random())
      .then((response) => {
        setColumnList(response.data.columnList)
      })
      .catch((error) => {
        console.log(`ERROR - ${error.message}`)
      })

    axios
      .get(
        `http://${window.location.hostname}:${PORT}/setting?` + Math.random()
      )
      .then((response) => {
        setSettingColumnList(response.data.columnList)
        setSettingModelList(response.data.modelList)
        setSettingEvalList(response.data.evalList)
      })
      .catch((error) => {
        console.log(`ERROR - ${error.message}`)
      })
  }, [])

  return (
    <div>
      <div className="main" style={mainLayout2Style}>
        <FileUpload />
        <Setting dataSettingColumnList={dataSettingColumnList} dataSettingModelList={dataSettingModelList} dataSettingEvalList={dataSettingEvalList} />
        <Visualization />
        <ModelOverview />
        <ModelDetail />
        <DetailAction dataColumnList={dataColumnList} />
      </div>
    </div>
  )
}

export default Home
