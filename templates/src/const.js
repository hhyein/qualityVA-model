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
    'dataset chart-table-top-left chart-table-top-right right-charts'
    'table-chart chart-table chart-table right-charts'
    'table-chart tree-chart tree-chart right-charts'
    'line-chart center-charts center-charts right-charts'
    'visualization center-charts center-charts right-charts'
    'visualization interaction interaction right-charts'
  `,
}

export const boxTitles = {
  dataset: '데이터셋 타이틀',
  'table-chart': '테이블차트 타이틀',
  'line-chart': '라인차트 타이틀',
  visualization: 'visualization 타이틀',
  'chart-table-top-left': '차트 테이블 좌측 위',
  'chart-table-top-right': '차트 테이블 우측 위',
  'tree-chart': '트리 차트',
  'center-chart': '중앙 차트들',
  interaction: 'interaction 타이틀',
  'right-charts': '우측 차트들',
}
