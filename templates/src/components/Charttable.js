import React from 'react'
import Barchart1 from './Barchart1'

const exampleData = [
  {
    key: 'column 1',
    missing: <Barchart1 />,
    outlier: <Barchart1 />,
    incons: <Barchart1 />,
    'quantile statistics': <Barchart1 />,
    'descriptive statistics': <Barchart1 />,
  },
  {
    key: 'column 2',
    missing: <Barchart1 />,
    outlier: <Barchart1 />,
    incons: <Barchart1 />,
    'quantile statistics': <Barchart1 />,
    'descriptive statistics': <Barchart1 />,
  },
  {
    key: 'column 3',
    missing: <Barchart1 />,
    outlier: <Barchart1 />,
    incons: <Barchart1 />,
    'quantile statistics': <Barchart1 />,
    'descriptive statistics': <Barchart1 />,
  },
]
export default function Charttable(props) {
  const { data = exampleData, onClick } = props

  return data.length > 0 ? (
    <table border={1}>
      <thead>
        <tr>
          {Object.keys(data[0]).map(key => (
            <td key={key}>{key}</td>
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
