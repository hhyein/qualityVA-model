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
  gridTemplateRows: "80px 110px 190px 110px 100px 220px",
  gridTemplateAreas: `
    'dataset overview tree-chart'
    'setting overview tree-chart'
    'setting instance-level tree-chart'
    'data-overview instance-level model'
    'data-overview class-level model'
    'data-overview class-level visualization'
  `,
}

export const boxTitles = {
  dataset: "dataset upload",
  setting: "setting",
  "table-chart": "dataset",
  visualization: "nl4dv",
  overview: "overview",
  "class-level": "class level",
  "instance-level": "instance level",
  "tree-chart": "action log",
  model: "model accuracy",
}

export const PORT = 5000
