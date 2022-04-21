import React from "react"
import axios from "axios"
import Select from "react-select"
import { Box } from "../../Box"
import { PORT } from "../../../const"
import Title from "../../Title"

export default function Action(props) {
  const { dataTypeList } = props

  const target = [
    { label: "missing", value: 0 },
    { label: "outlier", value: 1 },
    { label: "incons", value: 2 },
  ]

  const column = dataTypeList

  const action = [
    { label: "remove", value: 0 },
    { label: "min", value: 1 },
    { label: "max", value: 2 },
    { label: "mean", value: 3 },
    { label: "mode", value: 4 },
    { label: "median", value: 5 },
    { label: "EM", value: 6 },
    { label: "LOCF", value: 7 },
  ]

  const value = []

  const loadOptions = (inputValue) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          action.filter((item) =>
            item.label.toLowerCase().includes(inputValue.toLowerCase())
          )
        )
      }, 1000)
    })

  return (
    <Box title="action">
      <Title title="issue to be replaced" />
      <Select
        options={target}
        loadOptions={loadOptions}
        onChange={(e) => {
          value[0] = e.value
        }}
      />
      <Title title="column to be action on" />
      <Select
        options={column}
        loadOptions={loadOptions}
        onChange={(e) => {
          value[1] = e.value
        }}
      />
      <Title title="action method" />
      <Select
        options={action}
        loadOptions={loadOptions}
        onChange={(e) => {
          value[2] = e.value
          axios
            .post(
              `http://${window.location.hostname}:${PORT}/action?` +
                Math.random(),
              value
            )
            .then((response) => {
              console.log(response.data)
              window.location.reload()
            })
            .catch((error) => {
              console.log(`ERROR - ${error.message}`)
            })
        }}
      />
    </Box>
  )
}

/* isMulti */
/* window.location.reload() */