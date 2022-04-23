import React from 'react'
import { Box } from '../../Box'
import Legend from '../../Legend'
import LineChart from './LineChart'
import HorizontalTreeChart from './HorizontalTreeChart'
import ModelOverviewTable from './ModelOverviewTable'

const dataColorInfo = {
  lr: '#eb3477',
  knn: '#8934eb',
  nb: '#4ceb34',
}

export default function ModelOverview({ data }) {
  const {
    lineChart,
    treeChart,
    actionList,
    actionDetailList,
    barChartList,
    histogramChartList,
  } = data
  return (
    <Box
      title="model-overview"
      style={{
        display: 'grid',
        gridTemplateRows: 'auto 1fr 200px',
      }}
    >
      {!Object.values(data).some(value => value === undefined) && (
        <>
          <Legend dataColorInfo={dataColorInfo} />
          <LineChart data={lineChart} />
          <div style={{ overflow: 'auto' }}>
            <ModelOverviewTable
              thead={<HorizontalTreeChart data={[treeChart]} />}
              theadColSpan={treeChart.treeLength}
              data={{
                actionList,
                actionDetailList,
                barChartList,
                histogramChartList,
              }.map((list, i) =>
                list.reduce(
                  (acc, cur, j) => ({
                    ...acc,
                    [j]: cur,
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
