import React from 'react'

export default function ChartTable(props) {
  const { data = [], onTableCellClick } = props

  const columnKeys = Object.keys(data[0]).slice(1)
  console.log(data)
  return data.length > 0 ? (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `auto auto auto repeat(${
          columnKeys.length - 2
        }, 1fr)`,
      }}
    >
      <div className="grid-th" />
      {columnKeys.map((key, i) => (
        <div
          className="grid-th"
          key={key}
          style={{
            textAlign: 'center',
            fontWeight: 'bold',
            borderRight: i === columnKeys.length - 1 ? 'none' : undefined,
          }}
        >
          {key}
        </div>
      ))}
      {data.map(({ key, ...others }, rowIdx) => {
        const isLastRow = rowIdx === data.length - 1
        return (
          <React.Fragment key={rowIdx}>
            <div
              className="grid-td"
              style={{
                fontWeight: 'bold',
                borderBottom: isLastRow ? 'none' : undefined,
              }}
            >
              {key}
            </div>
            {Object.values(others).map((chart, colIdx) => (
              <div
                className="grid-td"
                key={`${rowIdx}${colIdx}`}
                onClick={() => onTableCellClick(rowIdx)}
                style={{
                  borderRight:
                    colIdx === columnKeys.length - 1 ? 'none' : undefined,
                  borderBottom: isLastRow ? 'none' : undefined,
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
