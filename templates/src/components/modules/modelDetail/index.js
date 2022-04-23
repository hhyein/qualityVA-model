import axios from "axios"
import React, { useEffect, useState } from "react"
import { PORT } from "../../../const"
import { Box } from "../../Box"
import ChartTable from "./ChartTable"
import HorizontalBarChart from "../../charts/HorizontalBarChart"

export default function ModelDetail() {
  const [dataChartTable, setChartTable] = useState([])

  useEffect(() => {
    axios
      .get(
        `http://${window.location.hostname}:${PORT}/chartTable?` +
          Math.random()
      )
      .then((response) => {
        setChartTable(response.data)
      })
      .catch((error) => {
        alert(`ERROR - ${error.message}`)
      })
  }, [])

  return (
    <Box
      title="model-detail"
      style={{overflow: 'auto'}}
    >
      <ChartTable
        data={Array.from(
          { length: Object(dataChartTable.columnList).length },
          (_, i) => ({
            key: i,
            combination: (
              <img src={require("../../icons/sample.jpg")} alt={""} style={{height:'20px', width:'20px'}}></img>
            ),
            combinationDetail: (
              <img src={require("../../icons/sample.jpg")} alt={""} style={{height:'20px', width:'20px'}}></img>
            ),
            accuracy: (
              <HorizontalBarChart
                data={[Object.values(dataChartTable)[1][i]]}
                colorCode={'steelblue'}
              ></HorizontalBarChart>
            ),
            AUC: (
              <HorizontalBarChart
                data={[Object.values(dataChartTable)[2][i]]}
                colorCode={'orange'}
              ></HorizontalBarChart>
            ),
            recall: (
              <HorizontalBarChart
                data={[Object.values(dataChartTable)[3][i]]}
                colorCode={'darkgreen'}
              ></HorizontalBarChart>
            )
          })
        )}
      />
    </Box>
  )
}
