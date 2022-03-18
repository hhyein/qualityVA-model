import React from 'react'
import Linechart from './Linechart'

/*
  data 형식이
  [
    {
      key: string(row 이름)
      missing: 차트
      incons: 차트
      .
      .
      .
      .
    },
    ...
  ]
  
  missing이나 incons는 예시임 table column 이름들을 넣어주면 됨
*/
const exampleData = [
  {
    key: 'row1',
    missing: (
      <Linechart
        data={[
          { date: 'A', unemployed: 70 },
          { date: 'B', unemployed: 50 },
          { date: 'C', unemployed: 90 },
        ]}
      />
    ),
    outlier: <Linechart data={[]} />,
    incons: <Linechart data={[]} />,
    'quantile statistics': <Linechart data={[]} />,
    'descriptive statistics': <Linechart data={[]} />,
  },
]
export default function Charttable(props) {
  const { data = exampleData } = props

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
        {data.map(({ key, ...others }) => (
          <tr>
            <th>{key}</th>
            {Object.values(others).map(chart => (
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
