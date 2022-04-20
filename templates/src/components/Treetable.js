import React, { useState, useEffect } from "react"
import axios from "axios"
import Treechart2 from "./Treechart2"

export default function Treetable() {
  const PORT = 5000
  const exampleDataList = [
    {
      actionName: "EM",
      data: "alcohol",
    },
    {
      actionName: "LOCF",
      data: "hue",
    },
    {
      actionName: "normalization",
      data: "proline",
    },
    {
      actionName: "remove",
      data: "class",
    },
    {
      actionName: "remove",
      data: "class",
    },
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
        console.log(`ERROR - ${error.message}`)
      })
  }, [])

  return (
    <table style={{ minWidth: "90%" }}>
      <thead>
        <th>action index</th>
        <th>action name</th>
        <th>data</th>
      </thead>
      <tbody>
        {exampleDataList.map((data, idx) => (
          <tr key={idx}>
            {idx === 0 && (
              <td rowSpan={exampleDataList.length} style={{ borderBottom: 0 }}>
                <Treechart2 data={[dataTreechart]} />
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
