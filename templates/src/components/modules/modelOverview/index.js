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
          <LineChart data={data.lineChart} />
          <div style={{ overflow: 'auto' }}>
            <ModelOverviewTable
              thead={<HorizontalTreeChart data={[data.treeChart]} />}
              theadColSpan={data.treeChart.treeLength}
              data={[
                {
                  chart1: 'eee',
                  chart2: 'eee',
                  chart3: 'eee',
                  chart4: 'eee',
                  chart5: 'eee',
                  chart6: 'eee',
                },
                {
                  chart1: 'eee',
                  chart2: 'eee',
                  chart3: 'eee',
                  chart4: 'eee',
                  chart5: 'eee',
                  chart6: 'eee',
                },
                {
                  chart1: 'eee',
                  chart2: 'eee',
                  chart3: 'eee',
                  chart4: 'eee',
                  chart5: 'eee',
                  chart6: 'eee',
                },
                {
                  chart1: 'eee',
                  chart2: 'eee',
                  chart3: 'eee',
                  chart4: 'eee',
                  chart5: 'eee',
                  chart6: 'eee',
                },
                {
                  chart1: 'eee',
                  chart2: 'eee',
                  chart3: 'eee',
                  chart4: 'eee',
                  chart5: 'eee',
                  chart6: 'eee',
                },
              ]}
            />
          </div>
        </>
      )}
    </Box>
  )
}
