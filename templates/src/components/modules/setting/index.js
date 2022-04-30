import React from "react"
import Select from "react-select"
import Title from "../../Title"
import { Box } from "../../Box"
import { useFileData } from "../../../contexts/FileDataContext"

export default function Setting() {
  const {
    isEmptyData,
    settingData: { columnList, modelList, evalList, dimensionList },
    settingValues,
    setSettingValues,
  } = useFileData()

  const handleChange = (key, value) => {
    setSettingValues((prev) => ({
      ...prev,
      [key]: value,
    }))
  }
  console.log(columnList)
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
            value={settingValues.column}
            placeholder={<div>select column</div>}
            onChange={(v) => {
              handleChange("column", v)
            }}
          />
          <Title title="machine learning model" />
          <Select
            isMulti
            options={modelList}
            placeholder={<div>select model</div>}
            onChange={(v) => handleChange("model", v)}
          />
          <Title title="evaluation method" />
          <Select
            isMulti
            options={evalList}
            placeholder={<div>select method</div>}
            onChange={(v) => handleChange("eval", v)}
          />
          <Title title="dimension reduction method" />
          <Select
            options={dimensionList}
            placeholder={<div>select method</div>}
            onChange={(v) => {
              handleChange("dimension", v)
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
