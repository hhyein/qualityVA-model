import React from 'react'

export default function ChartTable(props) {
  const { data = [], onTableCellClick } = props

  return data.length > 0 ? (
    <table style={{ minWidth: '100%', margin: 0 }}>
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
          <tr key={rowIdx}>
            <th>{key}</th>
            {Object.values(others).map((chart, colIdx) => (
              <td style={{height: 0}}
                key={`${rowIdx}${colIdx}`}
                onClick={() => onTableCellClick(rowIdx)}
              >
                {chart}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <></>
  )
}
