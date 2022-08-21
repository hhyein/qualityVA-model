import React from 'react'
import Select from 'react-select'
import Title from '../../Title'

export default function Action({ onSelectChange }) {
  const action = [
    { label: 'none', value: 0 },
    { label: 'remove', value: 1 },
    { label: 'min', value: 2 },
    { label: 'max', value: 3 },
    { label: 'mean', value: 4 },
    { label: 'mode', value: 5 },
    { label: 'median', value: 6 },
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
