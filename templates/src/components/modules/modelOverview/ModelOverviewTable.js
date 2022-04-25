import React from 'react'

export default function ModelOverviewTable(props) {
  const { data = [], thead, theadColSpan } = props

  return data.length > 0 ? (
    <table style={{ margin: 0 }}>
      <thead>
        {thead && (
          <tr>
            <th
              colSpan={theadColSpan ?? 6}
              style={{ height: '40px', background: 'white', padding: 0 }}
            >
              {thead}
            </th>
          </tr>
        )}
      </thead>
      <tbody>
        {data.map(({ key, ...others }, rowIdx) => (
          <tr key={rowIdx}>
            {Object.values(others).map((chart, colIdx) => (
              <td key={`${rowIdx}${colIdx}`} style={{ width: '70px' }}>
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
