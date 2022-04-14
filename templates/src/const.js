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
  gridTemplateColumns: '300px 450px 450px 300px',
  gridTemplateRows: '80px 180px 100px 150px 250px 70px',
  gridTemplateAreas: `
    'dataset chart-table-top-left chart-table-top-right right-charts'
    'table-chart chart-table chart-table right-charts'
    'table-chart tree-chart tree-chart right-charts'
    'line-chart center-charts center-charts right-charts'
    'visualization center-charts center-charts right-charts'
    'visualization interaction interaction right-charts'
  `,
}
