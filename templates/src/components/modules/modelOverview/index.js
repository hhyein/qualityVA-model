import React from 'react'
import { Box } from '../../Box'
import Legend from '../../Legend'
import LineChart from '../../charts/LineChart'
import HorizontalTreeChart from '../../charts/HorizontalTreeChart'
import ModelOverviewTable from './ModelOverviewTable'
import { useFileData } from '../../../contexts/FileDataContext'

const dataColorInfo = {
  lr: '#eb3477',
  knn: '#8934eb',
  nb: '#4ceb34',
}

export default function ModelOverview() {
  const { modelOverviewData, isEmptyData } = useFileData()

  const {
    lineChart,
    treeChart,
    treeLength,
    actionList,
    actionDetailList,
    barChartList,
    histogramChartList,
  } = modelOverviewData

  return (
    <Box
      title="model-overview"
      style={{
        display: 'grid',
        gridTemplateRows: 'auto 1fr 1fr',
      }}
    >
      {!isEmptyData({
        lineChart,
        treeChart,
        treeLength,
        actionList,
        actionDetailList,
        barChartList,
        histogramChartList,
      }) && (
        <>
          <Legend dataColorInfo={dataColorInfo} />
          <LineChart data={lineChart} />
          <div style={{ overflow: 'auto' }}>
            <ModelOverviewTable
              thead={<HorizontalTreeChart data={[treeChart]} />}
              theadColSpan={treeLength}
              data={[
                actionList,
                actionDetailList,
                barChartList,
                histogramChartList,
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
