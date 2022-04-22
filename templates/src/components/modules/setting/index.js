import React from "react"
import axios from "axios"
import Select from "react-select"
import Title from "../../Title"
import { PORT } from "../../../const"
import { Box } from "../../Box"
import RadioButton from "../../RadioButton"

export default function Setting(props) {
  const { dataTypeList, dataEvalList } = props
  
  const evalList = dataEvalList
  const typeList = dataTypeList

  const value = []

  const loadOptions = (inputValue) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          typeList.filter((item) =>
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
      <Title title="model to use" />
      <Select
        isMulti
        options={evalList}
        loadOptions={loadOptions}
        placeholder={<div>select model</div>}
        onChange={(e) => {
          value[0] = e.value
        }}
      />    
      <Title title="evaluation method to use" />
      <Select
        isMulti
        options={typeList}
        loadOptions={loadOptions}
        placeholder={<div>select evaluation method</div>}
        onChange={(e) => {
          value[1] = e.value
          // axios
          //   .post(`http://${window.location.hostname}:${PORT}/action?` + Math.random(), value)
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
