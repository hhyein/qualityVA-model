import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Tablechart from '../components/Tablechart';
import Barchart1 from '../components/Barchart1';
import Barchart2 from '../components/Barchart2';
import Charttable from '../components/Charttable';

import Treechart from '../components/Treechart';

import Histogramchart1 from '../components/Histogramchart1';
import Histogramchart2 from '../components/Histogramchart2';
import Correlationchart from '../components/Correlationchart';
import Scatterchart from '../components/Scatterchart';

import Spiderchart from '../components/Spiderchart';
import Densitychart from '../components/Densitychart';
import Boxchart from '../components/Boxchart';

const PORT = 5000

const Home =()=> {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(`http://${window.location.hostname}:${PORT}/static/unemployment.json?` + Math.random())
      .then(response => {
        console.log(response.data)
        setData(response.data)
      })
      .catch(error => {
        alert(`ERROR - ${error.message}`)
      })
  }, [])

  return (
    <div className="main">
      <div className="divide-same-width">
        <div className="box overflow-scroll">
          <Tablechart data={data} />
        </div>
        <div className="box overflow-scroll">
          <div>
            <Barchart1 />
            <Barchart2 />
          </div>
          <div><Charttable /></div>
        </div>
      </div>
      <div className="box vertical-align-center">
        <Treechart />
      </div>
      <div className="divide-same-width">
        <div className="divide-same-width box">
          <div style={{ borderRight: '2px dashed black' }}>
            <Histogramchart1 />
          </div>
          <div>
            <Histogramchart2 />
            <Histogramchart2 />
            <Histogramchart2 />
            <Histogramchart2 />
            <Histogramchart2 />
          </div>
        </div>
        <div className="box">
          <Correlationchart />
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
