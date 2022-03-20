import React from 'react'
import Barchart1 from './Barchart1'

export default function Charttable(props) {
  const { data = [], onClick } = props

  return data.length > 0 ? (
    <table>
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
              <td onClick={() => onClick(rowIdx, colIdx)}>{chart}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <></>
  )
}
