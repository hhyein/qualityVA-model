import React from 'react'

export default function ChartTable(props) {
  const { data = [], onClick } = props

  return data.length > 0 ? (
    <table style = {{ minWidth: '100%' }}>
      <thead>
        <tr>
          <th />
          {Object.keys(data[0])
            .slice(1)
            .map(key => (
              <th key={key}>{key}</th>
            ))}
        </tr>
      </thead>
      <tbody>
        {data.map(({ key, ...others }, rowIdx) => (
          <tr>
            <th>{key}</th>
            {Object.values(others).map((chart, colIdx) => (
              // onClick={() => onClick(rowIdx, colIdx)}
              <td>{chart}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <></>
  )
}
