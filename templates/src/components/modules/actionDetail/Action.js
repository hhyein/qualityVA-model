import React from 'react'
import Select from 'react-select'
import Title from '../../Title'

export default function Action({ onSelectChange }) {
  const action = [
    { label: 'None', value: 0 },
    { label: 'Remove', value: 1 },
    { label: 'Min', value: 2 },
    { label: 'Max', value: 3 },
    { label: 'Mean', value: 4 },
    { label: 'Mode', value: 5 },
    { label: 'Median', value: 6 },
    { label: 'EM', value: 7 },
    { label: 'LOCF', value: 8 },
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
    <div
      style={{
        display: 'grid',
        overflow: 'visible',
        gridGap: '5px',
      }}
    >
      <Title title="Action to do" />
      <Select
        options={action}
        loadOptions={loadOptions}
        placeholder={<div>Select action</div>}
        onChange={onSelectChange}
      />
    </div>
  )
}