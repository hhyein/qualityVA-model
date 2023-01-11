import React, { useState, useEffect, useRef } from 'react'

function ScatterChart(props) {
  const { data, method } = props
  const svgRef = useRef()
  const d3 = window.d3v4

  if (method === 1) {
    var df = []
    Object.assign(df, data.tsneDict)
  } else {
    var df = []
    Object.assign(df, data.pcaDict)
  }

  console.log(df)

  const [clicked, setClicked] = useState(false)
  const [X, setX] = useState([])
  const [Y, setY] = useState([])

  useEffect(() => {
    d3.select(svgRef.current).selectAll('*').remove()

    var margin = { top: 20, right: 20, bottom: 20, left: 20 },
      width = svgRef.current.clientWidth - margin.left - margin.right,
      height = svgRef.current.clientHeight - margin.top - margin.bottom

    var svg = d3
      .select(svgRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    var x = d3
      .scaleLinear()
      .domain([d3.min(df, function (d) { return d.value1 }) - 1, d3.max(df, function (d) { return d.value1 }) + 1])
      .range([0, width])
    svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x).ticks(0))
      .selectAll('text')
      .remove()

    var y = d3
      .scaleLinear()
      .domain([d3.min(df, function (d) { return d.value2 }) - 1, d3.max(df, function (d) { return d.value2 }) + 1])
      .range([height, 0])
      svg
      .append('g')
      .call(d3.axisLeft(y).ticks(0))
      .selectAll('text')
      .remove()

    var color = d3.scaleOrdinal()
      .domain([0, 1, 3])
      .range(["#1AA46D", "#1A5289", "#F53B3B"])

    svg
      .append('g')
      .selectAll('dot')
      .data(df)
      .enter()
      .append('circle')
      .attr('cx', function (d) {
        return x(d.value1)
      })
      .attr('cy', function (d) {
        return y(d.value2)
      })
      .attr('r', 3)
      .style("fill", function (d) { return color(d.sex) } )

    d3
      .selectAll('svg')
      .on('click', function () {
        d3.event.preventDefault()
        setClicked(false)
    })

    d3.selectAll('circle')
      .on('contextmenu', function () {
        d3.event.preventDefault()
        setClicked(true)
        setX(d3.event.layerX)
        setY(d3.event.layerY)
    })
  }, [props.data, props.method])

  return (
    <>
      <svg ref={svgRef} style={{ width: '100%', height: '85%' }}></svg>
      {clicked && (
        <div
          className="contextMenu"
          style={{ position: 'absolute', zIndex: 1, left: X, top: Y, width: '130px' }}
        >
          <div className="contextMenu--option">visual interactive labeling</div>
          <div className="contextMenu--separator" />
          <div className="contextMenu--option">imputation</div>
          <div className="contextMenu--separator" />
          <div className="contextMenu--option">transform</div>
          <div className="contextMenu--separator" />
          <div className="contextMenu--option">exit</div>
        </div>
      )}
    </>
  )
}
export default ScatterChart
