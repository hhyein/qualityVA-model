import React, { useState, useEffect } from 'react'
import axios from 'axios'

import { mainLayout2Style } from '../const'
import FileUpload from '../components/modules/fileUpload'
import Setting from '../components/modules/setting'
import ModelOverview from '../components/modules/modelOverview'
import Visualization from '../components/modules/visualization'
import ModelDetail from '../components/modules/modelDetail'
import ActionDetail from '../components/modules/actionDetail'
import useFileData from '../hooks/useFileData'

const PORT = 5000

const Home = () => {
  const [file, setFile] = useState()
  const { modelOverviewData, modelDetailData } = useFileData(file)
  const [dataColumnList, setColumnList] = useState([])
  const [dataSettingColumnList, setSettingColumnList] = useState([])
  const [dataSettingModelList, setSettingModelList] = useState([])
  const [dataSettingEvalList, setSettingEvalList] = useState([])
  console.log(modelOverviewData)
  const handleDrop = files => {
    setFile(files[0])
    var formData = new FormData()
    const config = {
      header: { 'content-type': 'multipart/form-data' },
    }
    formData.append('file', files[0])
    axios
      .post(
        `http://${window.location.hostname}:${PORT}/fileUpload?` +
          Math.random(),
        formData,
        config
      )
      .then(response => {
        console.log(response.data)
      })
      .catch(error => {
        console.log(`ERROR - ${error.message}`)
      })
  }

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

  return (
    <div>
      <div className="main" style={mainLayout2Style}>
        <FileUpload fileName={file?.name} handleDrop={handleDrop} />
        <Setting
          dataSettingColumnList={dataSettingColumnList}
          dataSettingModelList={dataSettingModelList}
          dataSettingEvalList={dataSettingEvalList}
        />
        <Visualization />
        <ModelOverview data={modelOverviewData} />
        <ModelDetail data={modelDetailData} />
        <ActionDetail dataColumnList={dataColumnList} />
      </div>
    </div>
  )
}

export default Home
