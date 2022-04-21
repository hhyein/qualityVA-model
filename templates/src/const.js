export const mainLayout1Style = {
  gridTemplateRows: "100px 400px 100px 500px 300px",
  gridTemplateAreas: `
    'title title'
    'table-chart horizontal-bar-chart'
    'tree-chart tree-chart'
    'vertical-bar-chart scatter-chart'
    'other-chart other-chart'
  `,
}

export const mainLayout2Style = {
  gridGap: "10px",
  gridTemplateColumns: "300px 900px 300px",
  gridTemplateRows: "80px 120px 100px 70px 150px 150px",
  gridTemplateAreas: `
    'data-upload model-overview detail-action'
    'setting model-overview detail-action'
    'setting model-overview detail-action'
    'setting overview detail-action'
    'visualization overview detail-action'
    'visualization overview detail-action'
  `,
}

export const boxTitles = {
  "data-upload": "data upload",
  setting: "setting",
  action: "action",
  "model-overview": "model overview",
  overview: "overview",
  "data-overview": "data overview",
  "detail-action": "detail-action",
  visualization: "nl4dv",
}

export const PORT = 5000
