import React from "react"
import { Box } from "../../Box"
import ChartTable from "./ChartTable"
import HorizontalBarChart from "../../charts/HorizontalBarChart"
import { useFileData } from "../../../contexts/FileDataContext"

export default function ModelOverview() {
  const { modelOverviewData, isEmptyData, setSelectedModelOverviewTableRow } =
    useFileData()
  const { chartTable } = modelOverviewData

  return (
    <Box title="model-overview" style={{ overflow: "auto" }}>
      {!isEmptyData({ chartTable }) && (
        <ChartTable
          onTableCellClick={(rowIdx) => setSelectedModelOverviewTableRow(rowIdx)}
          data={Array.from(
            { length: Object(chartTable.combinationList).length },
            (_, i) => ({
              key: i,
              combination: (
                <div style={{ display: "flex" }}>
                  <img
                    src={require("../../icons/missing.png")}
                    alt={""}
                    style={{ height: "25px", width: "25px" }}
                  ></img>
                  <img
                    src={require("../../icons/outlier.png")}
                    alt={""}
                    style={{ height: "25px", width: "25px" }}
                  ></img>
                  <img
                    src={require("../../icons/inconsistent.png")}
                    alt={""}
                    style={{ height: "25px", width: "25px" }}
                  ></img>
                  <img
                    src={require("../../icons/transformation.png")}
                    alt={""}
                    style={{ height: "25px", width: "25px" }}
                  ></img>
                </div>
              ),
              combinationDetail: (
                <div style={{ display: "flex" }}>
                  <img
                    src={require("../../icons/lof.png")}
                    alt={""}
                    style={{ height: "25px", width: "25px" }}
                  ></img>
                  <img
                    src={require("../../icons/em.png")}
                    alt={""}
                    style={{ height: "25px", width: "25px" }}
                  ></img>
                  <img
                    src={require("../../icons/rem.png")}
                    alt={""}
                    style={{ height: "25px", width: "25px" }}
                  ></img>
                  <img
                    src={require("../../icons/std.png")}
                    alt={""}
                    style={{ height: "25px", width: "25px" }}
                  ></img>
                </div>
              ),
              ...chartTable.inputEvalList.reduce(
                (acc, cur, j) => ({
                  ...acc,
                  [cur]: (
                    <HorizontalBarChart
                      data={[Object.values(chartTable)[j + 3][i]]}
                      colorCode={["lightcoral", "mediumturquoise", "sienna"][j]}
                    />
                  ),
                }),
                {}
              ),
            })
          )}
        />
      )}
    </Box>
  )
}