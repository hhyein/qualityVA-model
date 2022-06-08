import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Box } from '../../Box'
import ChartTable from './ChartTable'
import HorizontalBarChart from '../../charts/HorizontalBarChart'
import { useFileData } from '../../../contexts/FileDataContext'

export default function ModelOverview() {
  const {
    modelOverviewData,
    isEmptyData,
    modelOverviewTableSortingInfo,
    setModelOverviewTableSortingInfo,
    selectedModelOverviewTableRow,
    setSelectedModelOverviewTableRow,
  } = useFileData()
  const { chartTable } = modelOverviewData

  const data = useMemo(() => {
    if (!chartTable) {
      return []
    }
    return chartTable.combinationList.map((combination, i) => ({
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
  }, [chartTable])

  const sortedData = useMemo(() => {
    const { column, isAscending } = modelOverviewTableSortingInfo
    if (!column) {
      return []
    }
    const sortedChartTableData = data.sort((a, b) =>
      isAscending
        ? b[column].data - a[column].data
        : a[column].data - b[column].data
    )

    if (
      selectedModelOverviewTableRow === undefined &&
      sortedChartTableData.length > 0
    ) {
      const firstRow = sortedChartTableData[0]
      setSelectedModelOverviewTableRow({
        key: firstRow.key,
        combination: firstRow.combination,
        combinationDetail: firstRow.combinationDetail,
        model: firstRow.model,
      })
    }
    return sortedChartTableData
  }, [modelOverviewTableSortingInfo, data])

  const handleTableHeadClick = useCallback(
    columnName => {
      setModelOverviewTableSortingInfo(prev => ({
        ...prev,
        column: columnName,
      }))
    },
    [setModelOverviewTableSortingInfo]
  )

  return (
    <Box title="model-overview" style={{ overflow: 'auto' }}>
      {!isEmptyData({ chartTable }) && data.length > 0 && (
        <ChartTable
          canSortColumns={chartTable.inputEvalList}
          selectedColumn={modelOverviewTableSortingInfo.column}
          onTableHeadClick={handleTableHeadClick}
          onTableRowClick={params => setSelectedModelOverviewTableRow(params)}
          data={sortedData.map(d => ({
            key: d.key,
            ...['model'].reduce(
              (acc, cur) => ({
                ...acc,
                [cur]: d[cur],
              }),
              {}
            ),
            ...['combination', 'combinationDetail'].reduce(
              (acc, cur) => ({
                ...acc,
                [cur]: (
                  <div style={{ display: 'flex' }}>
                    {d[cur].map(imgName => (
                      <img
                        src={require(`../../icons/${imgName}.png`)}
                        alt={''}
                        style={{ height: '25px', width: '25px' }}
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
                    colorCode={['lightcoral', 'mediumturquoise', 'sienna'][j]}
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
