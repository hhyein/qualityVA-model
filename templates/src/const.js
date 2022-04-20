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
  gridTemplateRows: "80px 180px 100px 70px 150px 130px",
  gridTemplateAreas: `
    'data-upload model-overview data-overview'
    'setting model-overview data-overview'
    'setting model-overview data-overview'
    'setting overview detail-action'
    'action overview detail-action'
    'action overview visualization'
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
