import React from "react"
import Select from "react-select"
import Title from "../../Title"
import { Box } from "../../Box"
import { useFileData } from "../../../contexts/FileDataContext"

export default function Setting() {
  const {
    isEmptyData,
    settingData: { columnList, modelList, evalList, dimensionList },
  } = useFileData()

  const value = []
  const loadOptions = (inputValue) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          dimensionList.filter((item) =>
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
      {!isEmptyData({
        columnList,
        modelList,
        evalList,
        dimensionList,
      }) && (
        <>
          <Title title="column to predict" />
          <Select
            options={columnList}
            loadOptions={loadOptions}
            placeholder={<div>select column</div>}
            onChange={(e) => {
              value[0] = e.value
            }}
          />
          <Title title="machine learning model" />
          <Select
            isMulti
            options={modelList}
            loadOptions={loadOptions}
            placeholder={<div>select model</div>}
            onChange={(e) => {
              value[1] = e.value
            }}
          />
          <Title title="evaluation method" />
          <Select
            isMulti
            options={evalList}
            loadOptions={loadOptions}
            placeholder={<div>select method</div>}
            onChange={(e) => {
              value[2] = e.value
            }}
          />
          <Title title="dimension reduction method" />
          <Select
            options={dimensionList}
            loadOptions={loadOptions}
            placeholder={<div>select method</div>}
            onChange={(e) => {
              value[3] = e.value
              // axios
              //   .post(`http://${window.location.hostname}:${PORT}/?` + Math.random(), value)
              //   .then(response => {
              //     console.log(response.data);
              //     window.location.reload()
              //   })
              //   .catch(error => { alert(`ERROR - ${error.message}`) })
            }}
          />
        </>
      )}
    </Box>
  )
}
