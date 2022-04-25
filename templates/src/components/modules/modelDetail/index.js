import React from 'react'
import { Box } from '../../Box'
import ChartTable from './ChartTable'
import HorizontalBarChart from '../../charts/HorizontalBarChart'
import { useFileData } from '../../../contexts/FileDataContext'

export default function ModelDetail() {
  const { modelDetailData, isEmptyData, setSelectedModelDetailTableRow } =
    useFileData()
  const { chartTable } = modelDetailData

  return (
    <Box title="model-detail" style={{ overflow: 'auto' }}>
      {!isEmptyData({ chartTable }) && (
        <ChartTable
          onTableCellClick={rowIdx => setSelectedModelDetailTableRow(rowIdx)}
          data={Array.from(
            { length: Object(chartTable.columnList).length },
            (_, i) => ({
              key: i,
              combination: (
                <img
                  src={require('../../icons/sample.jpg')}
                  alt={''}
                  style={{ height: '20px', width: '20px' }}
                ></img>
              ),
              combinationDetail: (
                <img
                  src={require('../../icons/sample.jpg')}
                  alt={''}
                  style={{ height: '20px', width: '20px' }}
                ></img>
              ),
              accuracy: (
                <HorizontalBarChart
                  data={[Object.values(chartTable)[1][i]]}
                  colorCode={'steelblue'}
                ></HorizontalBarChart>
              ),
              AUC: (
                <HorizontalBarChart
                  data={[Object.values(chartTable)[2][i]]}
                  colorCode={'orange'}
                ></HorizontalBarChart>
              ),
              recall: (
                <HorizontalBarChart
                  data={[Object.values(chartTable)[3][i]]}
                  colorCode={'darkgreen'}
                ></HorizontalBarChart>
              ),
            })
          )}
        />
      )}
    </Box>
  )
}
