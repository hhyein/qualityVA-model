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
  gridTemplateColumns: '300px 600px 300px',
  gridTemplateRows: '80px 150px 200px 20px 100px 120px',
  gridTemplateAreas: `
    'data-upload model-overview action-detail'
    'setting model-overview action-detail'
    'setting model-detail action-detail'
    'setting model-detail action-detail'
    'visualization model-detail action-detail'
    'visualization model-detail action-detail'
  `,
}

export const boxTitles = {
  'data-upload': 'data upload',
  setting: 'setting',
  visualization: 'nl4dv',
  'model-overview': 'model overview',
  'model-detail': 'model detail',
  'action-detail': 'action detail',
}

export const PORT = 5000