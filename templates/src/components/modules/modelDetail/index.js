import React from "react"
import { Box } from "../../Box"
import ChartTable from "./ChartTable"
import HorizontalBarChart from "../../charts/HorizontalBarChart"
import { useFileData } from "../../../contexts/FileDataContext"

export default function ModelDetail() {
  const { modelDetailData, isEmptyData, setSelectedModelDetailTableRow } =
    useFileData()
  const { chartTable } = modelDetailData

  return (
    <Box title="model-detail" style={{ overflow: "auto" }}>
      {!isEmptyData({ chartTable }) && (
        <ChartTable
          onTableCellClick={(rowIdx) => setSelectedModelDetailTableRow(rowIdx)}
          data={Array.from(
            { length: Object(chartTable.combinationList).length },
            (_, i) => ({
              key: i,
              combination: (
                <div style={{ display: "flex" }}>
                  <img
                    src={require("../../icons/missing.png")}
                    alt={""}
                    style={{ height: "20px", width: "20px" }}
                  ></img>
                  <img
                    src={require("../../icons/outlier.png")}
                    alt={""}
                    style={{ height: "20px", width: "20px" }}
                  ></img>
                  <img
                    src={require("../../icons/inconsistent.png")}
                    alt={""}
                    style={{ height: "20px", width: "20px" }}
                  ></img>
                  <img
                    src={require("../../icons/transformation.png")}
                    alt={""}
                    style={{ height: "20px", width: "20px" }}
                  ></img>
                </div>
              ),
              combinationDetail: (
                <div style={{ display: "flex" }}>
                  <img
                    src={require("../../icons/missing.png")}
                    alt={""}
                    style={{ height: "20px", width: "20px" }}
                  ></img>
                  <img
                    src={require("../../icons/outlier.png")}
                    alt={""}
                    style={{ height: "20px", width: "20px" }}
                  ></img>
                  <img
                    src={require("../../icons/inconsistent.png")}
                    alt={""}
                    style={{ height: "20px", width: "20px" }}
                  ></img>
                  <img
                    src={require("../../icons/transformation.png")}
                    alt={""}
                    style={{ height: "20px", width: "20px" }}
                  ></img>
                </div>
              ),
              ...chartTable.inputEvalList.reduce(
                (acc, cur, j) => ({
                  ...acc,
                  [cur]: (
                    <HorizontalBarChart
                      data={[Object.values(chartTable)[j + 3][i]]}
                      colorCode={["steelblue", "orange", "darkgreen"][j]} // 임시 컬러 배열
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
