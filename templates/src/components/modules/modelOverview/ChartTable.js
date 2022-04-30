import React from "react"

export default function ChartTable({
  data = [],
  onTableCellClick,
  onTableHeadClick,
  canSortColumns,
  selectedColumn,
}) {
  const columnKeys = Object.keys(data[0]).slice(1)

  return data.length > 0 ? (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `auto auto auto auto repeat(${canSortColumns.length}, 1fr)`,
      }}
    >
      <div className="grid-th" />
      {columnKeys.map((key, i) => {
        const isSortButton = canSortColumns.includes(key)
        return (
          <div
            className="grid-th"
            key={key}
            style={{
              cursor: isSortButton ? "pointer" : "default",
              background: selectedColumn === key ? "#e1e1e1" : undefined,
              textAlign: "center",
              fontWeight: "bold",
              borderRight: i === columnKeys.length - 1 ? "none" : undefined,
            }}
            onClick={() => isSortButton && onTableHeadClick(key)}
          >
            {key}
          </div>
        )
      })}
      {data.map(({ key, ...others }, rowIdx) => {
        const isLastRow = rowIdx === data.length - 1
        return (
          <React.Fragment key={key}>
            <div
              className="grid-td"
              style={{
                fontWeight: "bold",
                borderBottom: isLastRow ? "none" : undefined,
              }}
            >
              {key}
            </div>
            {Object.values(others).map((chart, colIdx) => (
              <div
                className="grid-td"
                key={`${key}${colIdx}`}
                onClick={() => onTableCellClick(rowIdx)}
                style={{
                  borderRight:
                    colIdx === columnKeys.length - 1 ? "none" : undefined,
                  borderBottom: isLastRow ? "none" : undefined,
                }}
              >
                {chart}
              </div>
            ))}
          </React.Fragment>
        )
      })}
    </div>
  ) : (
    <></>
  )
}
