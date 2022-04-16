import React from 'react'
import axios from 'axios'
import Select from 'react-select'

function Dropdown() {
  const PORT = 5000
  const target = [
    { label: "missing", value: 0 },
    { label: "outlier", value: 1 },
    { label: "incons", value: 2 }
  ]
  const column = [
    { label: "0", value: 0 },
    { label: "1", value: 1 },
    { label: "2", value: 2 },
    { label: "3", value: 3 }
  ]
  const action = [
    { label: "remove", value: 0 },
    { label: "min", value: 1 },
    { label: "max", value: 2 },
    { label: "mean", value: 3 },
    { label: "mode", value: 4 },
    { label: "median", value: 5 },
    { label: "EM", value: 6 },
    { label: "LOCF", value: 7 }
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
      <Select options = { target } loadOptions = {loadOptions} onChange = { e => {
        value[0] = e.value
        }
      }/>
      <Select options = { column } loadOptions = {loadOptions} onChange = { e => {
        value[1] = e.value
        }
      }/>
      <Select options = { action } loadOptions = {loadOptions} onChange = { e => {
        value[2] = e.value
        axios
          .post(`http://${window.location.hostname}:${PORT}/action?` + Math.random(), value)
          .then(response => {
            console.log(response.data);
            window.location.reload()
          })
          .catch(error => { alert(`ERROR - ${error.message}`) })
        }
      }/>
    </>
  )
}

export default Dropdown
/* isMulti */
/* window.location.reload() */
