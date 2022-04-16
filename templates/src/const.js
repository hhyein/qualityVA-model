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
  gridGap: '10px',
  gridTemplateColumns: '300px 450px 450px 300px',
  gridTemplateRows: '80px 180px 100px 150px 250px 70px',
  gridTemplateAreas: `
    'dataset chart-table-top-left chart-table-top-right tree-chart'
    'setting chart-table chart-table tree-chart'
    'table-chart center-charts center-charts tree-chart'
    'table-chart center-charts center-charts model'
    'visualization center-charts center-charts model'
    'visualization interaction interaction model'
  `,
}

export const boxTitles = {
  dataset: 'dataset upload',
  setting: 'setting',
  'table-chart': 'dataset',
  visualization: 'nl4dv',
  'chart-table-top-left': 'high correlation column',
  'chart-table-top-right': 'class imbalance',
  'center-chart': 'data correction',
  interaction: 'action',
  'tree-chart': 'action log',
  'model': 'model accuracy'
}
