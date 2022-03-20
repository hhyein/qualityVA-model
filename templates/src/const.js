export const mainLayout1Style = {
  gridTemplateRows: '100px 400px 100px 500px 300px',
  gridTemplateAreas: `
    'title title'
    'table-chart horizontal-bar-chart'
    'tree-chart tree-chart'
    'vertical-bar-chart scatter-chart'
    'other-chart other-chart'
  `,
}

export const mainLayout2Style = {
  gridTemplateColumns: '1fr 1fr 0.5fr 0.5fr',
  gridTemplateRows: '100px 100px 200px 200px 200px 200px',
  gridTemplateAreas: `
    'title title title title'
    'table-chart tree-chart tree-chart tree-chart'
    'table-chart vertical-bar-chart vertical-bar-chart other-chart'
    'horizontal-bar-chart vertical-bar-chart vertical-bar-chart other-chart'
    'horizontal-bar-chart scatter-chart scatter-chart other-chart'
    'horizontal-bar-chart scatter-chart scatter-chart other-chart
  `,
}
