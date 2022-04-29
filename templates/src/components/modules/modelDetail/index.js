import React from 'react'
import { Box } from '../../Box'
import Legend from '../../Legend'
import LineChart from '../../charts/LineChart'
import HorizontalTreeChart from '../../charts/HorizontalTreeChart'
import ModelDetailTable from './ModelDetailTable'
import { useFileData } from '../../../contexts/FileDataContext'

const dataColorInfo = {
  lr: 'crimson',
  knn: 'mediumpurple',
  nb: 'yellowgreen',
}

export default function ModelDetail() {
  const { modelDetailData, isEmptyData } = useFileData()

  const {
    lineChart,
    treeChart,
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
        gridTemplateRows: 'auto auto auto 1fr',
      }}
    >
      {!isEmptyData({
        lineChart,
        treeChart,
        actionList,
        actionDetailList,
        barChartList,
        densityChartList,
      }) && (
        <>
          <Legend dataColorInfo={dataColorInfo} />
          <LineChart data={lineChart} dataLenght={treeChart.treeLength} />
          <HorizontalTreeChart data={[treeChart]} />
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