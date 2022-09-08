import React from 'react'
import { useFileData } from '../../../contexts/FileDataContext'

export default function ChartTable({
  data = [],
  onTableRowClick,
  onTableHeadClick,
  canSortColumns,
  selectedColumn,
}) {
  const { modelOverviewTableSortingInfo, selectedModelOverviewTableRow } = useFileData()
  const columnKeys = Object.keys(data[0]).slice(1)

  console.log(selectedModelOverviewTableRow)

  return data.length > 0 ? (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `auto auto auto auto repeat(${canSortColumns.length}, 1fr)`,
      }}
    >
      <div className="grid-th" style={{
            textAlign: 'center',
            fontWeight: 'bold',
      }}>
        Index
      </div>
      {columnKeys.map((key, i) => {
        const isSortButton = canSortColumns.includes(key)
        const selected = selectedColumn === key
        return (
          <div
            className="grid-th"
            key={key}
            style={{
              cursor: isSortButton ? 'pointer' : 'default',
              background: selected ? '#e1e1e1' : undefined,
              textAlign: 'center',
              fontWeight: 'bold',
              borderRight: i === columnKeys.length - 1 ? 'none' : undefined,
            }}
            onClick={() => isSortButton && onTableHeadClick(key)}
          >
            {key}
            {selected && (
              <>
                &nbsp;
                {modelOverviewTableSortingInfo.isAscending ? (
                  <>&uarr;</>
                ) : (
                  <>&darr;</>
                )}
              </>
            )}
          </div>
        )
      })}
      {data.slice(0, 500).map(({ key, ...others }, rowIdx) => {
        const isLastRow = rowIdx === data.length - 1
        const { combination, combinationDetail } = others
        const onClick = () => onTableRowClick({ key, rowIdx })
        return (
          <React.Fragment key={key}>
            <div
              className="grid-td"
              style={{
                textAlign: 'center',
                borderBottom: isLastRow ? 'none' : undefined,
                backgroundColor: selectedModelOverviewTableRow?.key === key ? '#e1e1e1' : undefined
              }}
              onClick={onClick}
            >
              {key}
            </div>
            {Object.values(others).map((chart, colIdx) => (
              <div
                className="grid-td"
                key={`${key}${colIdx}`}
                onClick={onClick}
                style={{
                  borderRight:
                    colIdx === columnKeys.length - 1 ? 'none' : undefined,
                  borderBottom: isLastRow ? 'none' : undefined,
                  backgroundColor: selectedModelOverviewTableRow?.key === key ? '#e1e1e1' : undefined
                }}
              >
                {colIdx < 3 || rowIdx < 6 ? chart : chart.props.data?.[0]?.data.toFixed(5)}
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
