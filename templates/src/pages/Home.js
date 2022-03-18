import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Tablechart from '../components/Tablechart'
import Spiderchart from '../components/Spiderchart'
import Densitychart from '../components/Densitychart'
import Boxchart from '../components/Boxchart'
import Scatterchart from '../components/Scatterchart'
import Correlationchart from '../components/Correlationchart'
import Charttable from '../components/Charttable'

const PORT = 5000
const palette = ['#f89b00', '#83dcb7', '#ffd400', '#003458']

const Home =()=> {
  const [data, setData] = useState([]);
  const [color, setColor] = useState('#000000')
  const [selectedColumn, setSelectedColumn] = useState('kstest')

  useEffect(() => {
    axios
      .get(
        `http://${window.location.hostname}:${PORT}/static/unemployment.json?` +
          Math.random()
      )
      .then(response => {
        console.log(response.data)
        setData(response.data)
      })
      .catch(error => {
        alert(`ERROR - ${error.message}`)
      })

      .catch(error => {
        alert(`ERROR - ${error.message}`)
      })
  }, [])

  const handleDataClick = (column, columnIdx) => {
    if (column === 'index') return
    setSelectedColumn(column)
    setColor(palette[columnIdx - 1])
  }

  return (
    <div className="main">
      <div className="divide-same-width">
        <div className="box overflow-scroll">
          <Tablechart data={data} onDataClick={handleDataClick} />
        </div>
        <div className="box overflow-scroll">
          <Charttable />
        </div>
      </div>
      <div className="box vertical-align-center">
        어쩌구 > 저쩌구 > 어쩌구 > 저쩌구
      </div>
      <div className="divide-same-width">
        <div className="divide-same-width box">
          <div style={{ borderRight: '2px dashed black' }}>점선 기준 왼쪽</div>
          <div>점선 기준 오른쪽</div>
        </div>
        <div className="box">
          <Scatterchart />
          <Scatterchart />
        </div>
      </div>
      <div className="box">
        <Spiderchart data={data} />
        <Spiderchart data={data} />
        {/* attribute d: Expected number, "M0,NaNL0.3999999999…". */}
        <Densitychart data={data} />
        <Densitychart data={data} />
        <Boxchart data={data} />
        <Boxchart data={data} />
      </div>
    </div>
  )
}

export default Home;
