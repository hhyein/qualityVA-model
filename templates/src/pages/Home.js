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
    <>
      <div className="main">
        <div className="left">
          <div className="table">
            <Tablechart data={data} onDataClick={handleDataClick} />
          </div>
          <div className="total">
            <Correlationchart />
          </div>
          <div className="column">
            <Charttable />
          </div>
        </div>
        <div className="right">
          <div className="action_log"></div>
          <div className="action"></div>
          <div className="quality">
            <Spiderchart data={data} />
            <Spiderchart data={data} />
            {/* attribute d: Expected number, "M0,NaNL0.3999999999…". */}
            <Densitychart data={data} />
            <Densitychart data={data} />
            <Boxchart data={data} />
            <Boxchart data={data} />
            <Scatterchart />
            <Scatterchart />
          </div>
          <div className="model">model</div>
        </div>
      </div>
    </>
  )
}

export default Home;
