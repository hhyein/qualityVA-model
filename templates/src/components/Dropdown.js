import React from 'react'
import axios from 'axios'
import Select from 'react-select'

function Dropdown(props) {
  const PORT = 5000
  const action = [
    { label: 'remove', value: 0 },
    { label: 'min', value: 1 },
    { label: 'max', value: 2 },
    { label: 'mean', value: 3 },
    { label: 'mode', value: 4 },
    { label: 'median', value: 5 },
    { label: 'EM', value: 6 },
    { label: 'LOCF', value: 7 },
  ]

  const loadOptions = inputValue =>
    new Promise(resolve => {
      setTimeout(() => {
        resolve(
          action.filter(item =>
            item.label.toLowerCase().includes(inputValue.toLowerCase())
          )
        )
      }, 1000)
    })

  return (
    <>
      {/* isMulti */}
      <Select
        options={action}
        loadOptions={loadOptions}
        onChange={e => {
          /* window.location.reload() */
          axios
            .post(
              `http://${window.location.hostname}:${PORT}/action?` +
                Math.random(),
              e.value
            )
            .then(response => {
              console.log(response.data)
            })
            .catch(error => {
              alert(`ERROR - ${error.message}`)
            })
        }}
        {...props}
      />
    </>
  )
}

export default Dropdown
