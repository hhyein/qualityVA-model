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
  gridTemplateColumns: '1fr 0.7fr 0.7fr 0.5fr',
  gridTemplateRows: '60px 100px 160px 160px 160px 160px 160px 160px',
  gridTemplateAreas: `
    'title title title title'
    'line-chart tree-chart tree-chart tree-chart'
    'line-chart class-level class-level other-chart'
    'table-chart class-level class-level other-chart'
    'table-chart feature-level feature-level other-chart'
    'horizontal-bar-chart feature-level feature-level other-chart'
    'horizontal-bar-chart vertical-bar-chart vertical-bar-chart other-chart'
    'horizontal-bar-chart vertical-bar-chart vertical-bar-chart other-chart'
  `,
}
