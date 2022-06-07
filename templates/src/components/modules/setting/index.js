import React from "react"
import Select from "react-select"
import Title from "../../Title"
import { Box } from "../../Box"
import { useFileData } from "../../../contexts/FileDataContext"

export default function Setting() {
  const {
    isEmptyData,
    settingData: { purposeList, columnList, modelList, evalList, dimensionList },
    settingValues,
    setSettingValues,
  } = useFileData()

  const handleChange = (key, value) => {
    setSettingValues((prev) => ({
      ...prev,
      [key]: value,
    }))
  }
  
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
          <Title title="purpose of data" />
          <Select
            options={purposeList}
            placeholder={<div>select purpose</div>}
            onChange={(v) => {
              handleChange("purpose", v)
            }}
          />
          <Title title="column to purpose" />
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
            }}
          />
        </>
      )}
    </Box>
  )
}
