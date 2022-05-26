import React, { useCallback, useEffect, useState } from "react"
import { Box } from "../../Box"
import ChartTable from "./ChartTable"
import HorizontalBarChart from "../../charts/HorizontalBarChart"
import { useFileData } from "../../../contexts/FileDataContext"

export default function ModelOverview() {
  const { modelOverviewData, isEmptyData, setSelectedModelOverviewTableRow } = useFileData()
  const { chartTable } = modelOverviewData

  const [data, setData] = useState([])
  const [selectedColumn, setSelectedColumn] = useState()

  useEffect(() => {
    if (!chartTable) {
      return
    }
    setData(
      chartTable.combinationList.map((combination, i) => ({
        key: combination,
        model: chartTable.modelNames[i],
        combination: chartTable.combinationIconList[i],
        combinationDetail: chartTable.combinationDetailIconList[i],
        ...chartTable.inputEvalList.reduce(
          (acc, cur) => ({
            ...acc,
            [cur]: chartTable[cur][i],
          }),
          {}
        ),
      }))
    )
  }, [chartTable])

  const handleTableHeadClick = useCallback((columnName) => {
    setSelectedColumn(columnName)
    setData((prev) =>
      prev.sort((a, b) => b[columnName].data - a[columnName].data)
    )
  }, [])

  return (
    <Box title="model-overview" style={{ overflow: "auto" }}>
      {!isEmptyData({ chartTable }) && data.length > 0 && (
        <ChartTable
          canSortColumns={chartTable.inputEvalList}
          selectedColumn={selectedColumn}
          onTableHeadClick={handleTableHeadClick}
          onTableCellClick={(rowIdx) =>
            setSelectedModelOverviewTableRow(rowIdx)
          }
          data={data.map((d) => ({
            key: d.key,
            ...["model"].reduce(
              (acc, cur) => ({
                ...acc,
                [cur]: d[cur],
              }),
              {}
            ),
            ...["combination", "combinationDetail"].reduce(
              (acc, cur) => ({
                ...acc,
                [cur]: (
                  <div style={{ display: "flex" }}>
                    {d[cur].map((imgName) => (
                      <img
                        src={require(`../../icons/${imgName}.png`)}
                        alt={""}
                        style={{ height: "25px", width: "25px" }}
                      />
                    ))}
                  </div>
                ),
              }),
              {}
            ),
            ...chartTable.inputEvalList.reduce(
              (acc, cur, j) => ({
                ...acc,
                [cur]: (
                  <HorizontalBarChart
                    data={[d[cur]]}
                    colorCode={["lightcoral", "mediumturquoise", "sienna"][j]}
                  />
                ),
              }),
              {}
            ),
          }))}
        />
      )}
    </Box>
  )
}
