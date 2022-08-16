import React from 'react'
import Select from 'react-select'
import Title from '../../Title'

export default function Action({ onSelectChange }) {
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
    <div
      style={{
        display: 'grid',
        overflow: 'visible',
        gridGap: '5px',
      }}
    >
      <Title title="action to do" />
      <Select
        options={action}
        loadOptions={loadOptions}
        placeholder={<div>select action</div>}
        onChange={onSelectChange}
      />
    </div>
  )
}
