import React from 'react'

export default function ModelOverviewTable(props) {
  const { data = [] } = props

  return data.length > 0 ? (
    <table style={{ minWidth: '100%', margin: 0 }}>
      <thead>
        <tr>
          {Object.keys(data[0]).map(key => (
            <th key={key}>{key}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map(({ key, ...others }, rowIdx) => (
          <tr>
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
