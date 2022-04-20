import React from 'react'
import axios from 'axios'
import Select from 'react-select'
import Title from "./Title"

function Setting(props) {
  const PORT = 5000
  const { dataTypeList, dataEvalList } = props

  const typeList = dataTypeList
  const evalList = dataEvalList
  const number = [
    { label: "1", value: 0 },
    { label: "3", value: 1 },
    { label: "5", value: 2 },
    { label: "10", value: 3 }
  ]

  const value = []

  const loadOptions = (inputValue, ) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        number.filter((item) =>
          item.label.toLowerCase().includes(inputValue.toLowerCase())
        )
      )
    }, 1000)
  })

  return (
    <>
      <Select options = { typeList } loadOptions = {loadOptions} placeholder={<div>select column</div>} onChange = { e => {
        value[0] = e.value
        }
      }/>
      <Title title="model evaluation method"/>
      <Select options = { evalList } loadOptions = {loadOptions} placeholder={<div>select method</div>} onChange = { e => {
        value[1] = e.value
        }
      }/>
      <Title title="number of models used"/>
      <Select options = { number } loadOptions = {loadOptions} placeholder={<div>select number</div>} onChange = { e => {
        value[2] = e.value
        // axios
        //   .post(`http://${window.location.hostname}:${PORT}/action?` + Math.random(), value)
        //   .then(response => {
        //     console.log(response.data);
        //     window.location.reload()
        //   })
        //   .catch(error => { alert(`ERROR - ${error.message}`) })
        }
      }/>
    </>
  )
}

export default Setting