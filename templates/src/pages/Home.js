import React, { useState, useEffect } from "react"
import axios from "axios"

import { mainLayout2Style } from "../const"
import DataUpload from "../components/modules/dataUpload"
import Setting from "../components/modules/setting"
import ModelOverview from "../components/modules/modelOverview"
import Visualization from "../components/modules/visualization"
import DetailAction from "../components/modules/detailAction"
import Overview from "../components/modules/overview"

const PORT = 5000

const Home = () => {
  const [dataColumnList, setColumnList] = useState([])
  const [dataTypeList, setTypeList] = useState([])
  const [dataEvalList, setEvalList] = useState([])

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
        setTypeList(response.data.typeList)
        setEvalList(response.data.evalList)
      })
      .catch((error) => {
        console.log(`ERROR - ${error.message}`)
      })
  }, [])

  return (
    <div>
      <div className="main" style={mainLayout2Style}>
        <DataUpload />
        <Setting dataTypeList={dataTypeList} dataEvalList={dataEvalList} />
        <Overview />
        <ModelOverview />
        <DetailAction columnList={dataColumnList} />
        <Visualization />
      </div>
    </div>
  )
}

export default Home
