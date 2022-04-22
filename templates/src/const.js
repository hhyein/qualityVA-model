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
  gridTemplateColumns: '300px 800px 300px',
  gridTemplateRows: '80px 140px 180px 20px 100px 150px',
  gridTemplateAreas: `
    'data-upload model-overview detail-action'
    'setting model-overview detail-action'
    'setting model-overview detail-action'
    'setting model-detail detail-action'
    'visualization model-detail detail-action'
    'visualization model-detail detail-action'
  `,
}

export const boxTitles = {
  'data-upload': 'data upload',
  setting: 'setting',
  visualization: 'nl4dv',
  'model-overview': 'model overview',
  'model-detail': 'model detail',
  'detail-action': 'detail-action',
}

export const PORT = 5000
