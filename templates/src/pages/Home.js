import React, { useState, useEffect } from "react"
import axios from "axios"
import Input from "../components/Input"
import Button from "../components/Button"
import NL4DV from "../components/modules/visualization/NL4DV"
import Histogramchart1 from "../components/modules/detailAction/HistogramChart"
import ECDFchart from "../components/ECDFchart"
import Instance from "../components/Instance"
import Class from "../components/Class"
import Treetable from "../components/Treetable"

import { mainLayout2Style } from "../const"
import { Box } from "../components/Box"
import DataOverview from "../components/modules/dataOverview"
import DataUpload from "../components/modules/dataUpload"
import Setting from "../components/modules/setting"
import ModelOverview from "../components/modules/modelOverview"
import Visualization from "../components/modules/visualization"
import Action from "../components/modules/action"
import DetailAction from "../components/modules/detailAction"
import Overview from "../components/modules/overview"

const PORT = 5000

const Home = () => {
  const [dataColumnList, setColumnList] = useState([])
  const [dataClassList, setClassList] = useState([])
  const [dataColorCode, setColorCode] = useState([])
  const [dataTypeList, setTypeList] = useState([])
  const [dataEvalList, setEvalList] = useState([])

  const [dataScatterchart, setScatterchart] = useState([])
  const [dataECDFchart, setECDFchart] = useState([])

  useEffect(() => {
    axios
      .get(`http://${window.location.hostname}:${PORT}/?` + Math.random())
      .then((response) => {
        setColumnList(response.data.columnList)
        setClassList(response.data.classList)
        setColorCode(
          Array.from(
            { length: Object(response.data.classList).length },
            () => "#" + Math.round(Math.random() * 0xffffff).toString(16)
          )
        )
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

    axios
      .get(
        `http://${window.location.hostname}:${PORT}/scatterchart?` +
          Math.random()
      )
      .then((response) => {
        setScatterchart(response.data)
      })
      .catch((error) => {
        console.log(`ERROR - ${error.message}`)
      })
    axios
      .get(
        `http://${window.location.hostname}:${PORT}/ECDFchart?` + Math.random()
      )
      .then((response) => {
        setECDFchart(response.data)
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
        <DataOverview columnList={dataColumnList} />
        <ModelOverview />
        <Action dataTypeList={dataTypeList} />
        <DetailAction />
        <Visualization />
      </div>
    </div>
  )
}

export default Home
