import axios from "axios"
import React, { useEffect, useState } from "react"
import { PORT } from "../../../const"
import { Box } from "../../Box"
import ChartTable from "./ChartTable"
import HorizontalBarChart from "../../charts/HorizontalBarChart"

export default function ModelDetail() {
  const [chartTableData, setChartTableData] = useState([])

  useEffect(() => {
    axios
      .get(
        `http://${window.location.hostname}:${PORT}/charttable?` +
          Math.random()
      )
      .then((response) => {
        setChartTableData(response.data)
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
          { length: Object(chartTableData.columnList).length },
          (_, i) => ({
            key: i,
            combination: (
              <img src={require("../../icons/sample.jpg")} alt={""} style={{height:'30px', width:'30px'}}></img>
            ),
            combinationDetail: (
              <img src={require("../../icons/sample.jpg")} alt={""} style={{height:'30px', width:'30px'}}></img>
            ),
            accuracy: (
              <HorizontalBarChart
                data={[Object.values(chartTableData)[1][i]]}
                colorCode={'steelblue'}
              ></HorizontalBarChart>
            ),
            AUC: (
              <HorizontalBarChart
                data={[Object.values(chartTableData)[2][i]]}
                colorCode={'orange'}
              ></HorizontalBarChart>
            ),
            recall: (
              <HorizontalBarChart
                data={[Object.values(chartTableData)[3][i]]}
                colorCode={'darkgreen'}
              ></HorizontalBarChart>
            )
          })
        )}
        // onClick={(rowIdx, colIdx) =>
        //   axios
        //     .post(
        //       `http://${window.location.hostname}:${PORT}/histogramchart1?` +
        //         Math.random(),
        //       { row: rowIdx, col: colIdx }
        //     )
        //     .then((response) => {
        //       setHistogramchart1(response.data)
        //     })
        //     .catch((error) => {
        //       alert(`ERROR - ${error.message}`)
        //     })
        // }
      />
    </Box>
  )
}
