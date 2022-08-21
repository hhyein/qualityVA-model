import React from 'react'
import { Box } from '../../Box'
import Legend from '../../Legend'
import LineChart from '../../charts/LineChart'
import HorizontalTreeChart from '../../charts/HorizontalTreeChart'
import ModelDetailTable from './ModelDetailTable'
import { useFileData } from '../../../contexts/FileDataContext'

const dataColorInfo = {
  lr: 'crimson',
  svm: 'mediumpurple',
  gbr: 'yellowgreen',
}

export default function ModelDetail() {
  const { modelDetailData, isEmptyData, modelOverviewTableSortingInfo } =
    useFileData()

  const {
    lineChart,
    treeChart,
    currentCnt,
    actionList,
    actionDetailList,
    barChartList,
    densityChartList,
  } = modelDetailData
  
  return (
    <Box
      title="model-detail"
      style={{
        display: 'grid',
        gridTemplateRows: 'auto auto 40px 1fr',
      }}
    >
      {!isEmptyData({
        lineChart,
        treeChart,
        currentCnt,
        actionList,
        actionDetailList,
        barChartList,
        densityChartList,
      }) && (
        <>
          <Legend dataColorInfo={dataColorInfo} />
          <LineChart data={lineChart} dataLenght={currentCnt} />
          <HorizontalTreeChart data={treeChart} dataLenght={currentCnt} />
          <div>
            <ModelDetailTable
              data={[
                actionList,
                actionDetailList,
                barChartList,
                densityChartList,
              ].map(list =>
                list.reduce(
                  (acc, cur, i) => ({
                    ...acc,
                    [i]: cur,
                  }),
                  {}
                )
              )}
            />
          </div>
        </>
      )}
    </Box>
  )
}
