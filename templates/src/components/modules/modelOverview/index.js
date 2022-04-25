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
    actionList,
    actionDetailList,
    barChartList,
    densityChartList,
  } = modelOverviewData

  return (
    <Box
      title="model-overview"
      style={{
        display: 'grid',
        gridTemplateRows: 'auto auto 1fr',
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
          <LineChart data={lineChart} />
          <div style={{ overflow: 'auto' }}>
            <ModelOverviewTable
              thead={<HorizontalTreeChart data={[treeChart]} />}
              theadColSpan={treeChart.treeLength}
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
