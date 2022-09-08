import React, { useCallback, useEffect, useState } from 'react'
import { Box } from '../../Box'
import HistogramChart from '../../charts/HistogramChart'
import ScatterChart from '../../charts/ScatterChart'
import Action from './Action'
import Legend from '../../Legend'
import HorizontalBarChart from '../../charts/HorizontalBarChart'
import HeatmapChart from '../../charts/HeatmapChart'
import IndexingButtonBox from '../../IndexingButtonBox'
import { postData, useFileData } from '../../../contexts/FileDataContext'

const dataColorInfo = {
  missing: 'steelblue',
  outlier: 'darkorange',
  incons: 'darkgreen',
}

export default function ActionDetail() {
  const {
    dataColumnList,
    actionDetailData,
    isEmptyData,
    selectedActionDetailHeatmapIndex,
    setSelectedActionDetailHeatmapIndex,
  } = useFileData()
  const {
    barChart,
    heatmapChart,
    heatmapChartY,
    histogramChart,
    scatterChart,
  } = actionDetailData

  const dimensionList = ['TSNE', 'PCA']
  const [dataTargetIdx, setDataTargetIdx] = useState(0)
  const [selectValue, setSelectValue] = useState()
  const [reductionMethodIdx, setReductionMethodIdx] = useState(0)

  const postActionData = useCallback(async () => {
    if (!selectValue) {
      return
    }
    await postData('/action', [
      dataTargetIdx,
      selectedActionDetailHeatmapIndex?.value ?? 0,
      selectValue,
    ])
  }, [selectValue, dataTargetIdx, selectedActionDetailHeatmapIndex])

  useEffect(() => {
    postActionData()
  }, [postActionData])

  return (
    <Box title="action-detail" style={{ backgroundColor: 'var(--grey-050)' }}>
      {!isEmptyData({
        barChart,
        heatmapChart,
        heatmapChartY,
        histogramChart,
        scatterChart,
      }) && (
        <>
          <Legend dataColorInfo={dataColorInfo} />
          <div
            style={{
              display: 'grid',
              gridGap: '10px',
              gridTemplateColumns: 'repeat(3, 1fr)',
              marginBottom: '10px',
            }}
          >
            {Object.entries(dataColorInfo).map(([k, v], i) => (
              <HorizontalBarChart
                data={[barChart[k]]}
                colorCode={v}
                onClick={() => setDataTargetIdx(i)}
              />
            ))}
          </div>
          <HeatmapChart
            data={heatmapChart[dataTargetIdx]}
            dataHeatmapChartYList={heatmapChartY}
            dataColumnList={dataColumnList}
            colorCode={Object.values(dataColorInfo)[dataTargetIdx]}
            onHeatmapCellClick={index =>
              setSelectedActionDetailHeatmapIndex(index)
            }
          />
          <IndexingButtonBox
            style={{ margin: '5px 0', height: '45%' }}
            componentInfo={{
              'Histogram': <HistogramChart data={histogramChart} />,
              'Scatter plot': (
                <>
                  <div style={{ display: 'flex' }}>
                    {dimensionList &&
                      dimensionList.map((item, idx) => (
                        <div key={item} style={{ marginRight: '10px' }}>
                          <input
                            type="radio"
                            name="radio"
                            value={item}
                            style={{ marginRight: '5px', accentColor: 'grey' }}
                            onClick={async () => {
                              setReductionMethodIdx(idx)
                            }}
                            checked={reductionMethodIdx === idx}
                          />
                          {item}
                        </div>
                      ))}
                  </div>
                  <ScatterChart data={scatterChart} method={reductionMethodIdx} />
                </>
              ),
            }}
          />
          <Action onSelectChange={e => setSelectValue(e.value)} />
        </>
      )}
    </Box>
  )
}
