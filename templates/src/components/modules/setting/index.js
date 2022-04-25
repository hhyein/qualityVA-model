import React from "react"
import axios from "axios"
import Select from "react-select"
import Title from "../../Title"
import { PORT } from "../../../const"
import { Box } from "../../Box"
import { useFileData } from "../../../contexts/FileDataContext"

export default function Setting() {
  const {
    dataSettingColumnList: columnList,
    dataSettingModelList: modelList,
    dataSettingEvalList: evaluationList,
  } = useFileData()

  const value = []

  const loadOptions = (inputValue) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          evaluationList.filter((item) =>
            item.label.toLowerCase().includes(inputValue.toLowerCase())
          )
        )
      }, 1000)
    })

  return (
    <Box
      title="setting"
      style={{
        display: "grid",
        overflow: "visible",
        gridGap: "5px",
      }}
    >
      <Title title="column to predict" />
      <Select
        isMulti
        options={columnList}
        loadOptions={loadOptions}
        placeholder={<div>select column</div>}
        onChange={(e) => {
          value[0] = e.value
        }}
      />
      <Title title="model to use" />
      <Select
        isMulti
        options={modelList}
        loadOptions={loadOptions}
        placeholder={<div>select model</div>}
        onChange={(e) => {
          value[1] = e.value
        }}
      />
      <Title title="evaluation method to use" />
      <Select
        isMulti
        options={evaluationList}
        loadOptions={loadOptions}
        placeholder={<div>select evaluation method</div>}
        onChange={(e) => {
          value[2] = e.value
          // axios
          //   .post(`http://${window.location.hostname}:${PORT}/?` + Math.random(), value)
          //   .then(response => {
          //     console.log(response.data);
          //     window.location.reload()
          //   })
          //   .catch(error => { alert(`ERROR - ${error.message}`) })
        }}
      />
    </Box>
  )
}
