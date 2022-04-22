import React, { useState, useEffect } from "react"
import axios from "axios"
import { PORT } from "../../../const"
import VerticalTreeChart from "./VerticalTreeChart"

export default function Treetable() {
  const exampleDataList = [
    {
      actionName: "EM",
      data: "alcohol"
    },
    {
      actionName: "LOCF",
      data: "hue"
    },
    {
      actionName: "normalization",
      data: "proline"
    },
    {
      actionName: "remove",
      data: "class"
    },
    {
      actionName: "remove",
      data: "class"
    }
  ]

  const [dataTreechart, setTreechart] = useState([])

  useEffect(() => {
    axios
    .get(
      `http://${window.location.hostname}:${PORT}/static/treeData.json?` +
        Math.random()
    )
    .then((response) => {
      setTreechart(response.data)
    })
    .catch((error) => {
      alert(`ERROR - ${error.message}`)
    })
  }, [])

  return (
    <table height="350px">
      <thead>
        <th>actionIndex</th>
        <th>actionName</th>
        <th>actionDetail</th>
        <th>barChart</th>
        <th>histogram</th>
      </thead>
      <tbody>
        {exampleDataList.map((data, idx) => (
          <tr key={idx}>
            {idx === 0 && (
              <td rowSpan={exampleDataList.length} style={{ borderBottom: 0 }}>
                <VerticalTreeChart data={[dataTreechart]} />
              </td>
            )}
            {Object.entries(data).map(([k, v]) => (
              <td key={k + idx}>{v}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}