import React from 'react'
import { Box } from '../../Box'
import ChartTable from './ChartTable'
import HorizontalBarChart from '../../charts/HorizontalBarChart'
import { useFileData } from '../../../contexts/FileDataContext'

export default function ModelDetail() {
  const {
    modelDetailData,
    isEmptyData,
    setSelectedModelDetailTableRow
  } = useFileData()
  const { chartTable } = modelDetailData

  return (
    <Box title="model-detail" style={{ overflow: 'auto' }}>
      {!isEmptyData({ chartTable }) && (
        <ChartTable
          onTableCellClick={rowIdx => setSelectedModelDetailTableRow(rowIdx)}
          data={Array.from(
            { length: Object(chartTable.combinationList).length },
            (_, i) => ({
              key: i,
              combination: (
                <div style={{ display: 'flex' }}>
                  <img
                    src={require('../../icons/missing.png')}
                    alt={''}
                    style={{ height: '20px', width: '20px' }}
                  ></img>
                  <img
                    src={require('../../icons/outlier.png')}
                    alt={''}
                    style={{ height: '20px', width: '20px' }}
                  ></img>
                  <img
                    src={require('../../icons/inconsistent.png')}
                    alt={''}
                    style={{ height: '20px', width: '20px' }}
                  ></img>
                  <img
                  src={require('../../icons/transformation.png')}
                  alt={''}
                  style={{ height: '20px', width: '20px' }}
                ></img>
                </div>
              ),
              combinationDetail: (
                <div style={{ display: 'flex' }}>
                  <img
                    src={require('../../icons/missing.png')}
                    alt={''}
                    style={{ height: '20px', width: '20px' }}
                  ></img>
                  <img
                    src={require('../../icons/outlier.png')}
                    alt={''}
                    style={{ height: '20px', width: '20px' }}
                  ></img>
                  <img
                    src={require('../../icons/inconsistent.png')}
                    alt={''}
                    style={{ height: '20px', width: '20px' }}
                  ></img>
                  <img
                  src={require('../../icons/transformation.png')}
                  alt={''}
                  style={{ height: '20px', width: '20px' }}
                ></img>
                </div>
              ),
              accuracy: (
                <div style={{ height: '100%' }}>
                  <HorizontalBarChart
                    data={[Object.values(chartTable)[3][i]]}
                    colorCode={'steelblue'}
                    type={'modelDetail'}
                  ></HorizontalBarChart>
                </div>
              ),
              AUC: (
                <HorizontalBarChart
                  data={[Object.values(chartTable)[4][i]]}
                  colorCode={'orange'}
                  type={'modelDetail'}
                ></HorizontalBarChart>
              ),
              recall: (
                <HorizontalBarChart
                  data={[Object.values(chartTable)[5][i]]}
                  colorCode={'darkgreen'}
                  type={'modelDetail'}
                ></HorizontalBarChart>
              ),
            })
          )}
        />
      )}
    </Box>
  )
}
