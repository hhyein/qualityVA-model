import React from 'react'
import axios from 'axios'
import Select from 'react-select'
import Title from "./Title"

function Class(props) {
  const PORT = 5000
  const { dataTypeList } = props
  
  const column = dataTypeList

  const action = [
    { label: "normalization", value: 0 },
    { label: "transformation", value: 1 },
    { label: "feature selection", value: 2 }
  ]

  const detailAction = [
    { label: "min-max", value: 0 },
    { label: "z-score", value: 1 },
    { label: "log", value: 2 },
    { label: "sqrt", value: 3 },
    { label: "box-cox", value: 4 },
    { label: "remove", value: 5 }
  ]

  const value = []

  const loadOptions = (inputValue, ) =>
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
    <>
      <Title title="column to be action on"/>
      <Select options = { column } loadOptions = {loadOptions} onChange = { e => {
        value[0] = e.value
        }
      }/>
      <Title title="action method"/>
      <Select options = { action } loadOptions = {loadOptions} onChange = { e => {
        value[1] = e.value
        }
      }/>
      <Title title="detail action method"/>
      <Select options = { detailAction } loadOptions = {loadOptions} onChange = { e => {
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

export default Class
/* isMulti */
/* window.location.reload() */