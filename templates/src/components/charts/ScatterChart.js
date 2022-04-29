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
      .domain([
        d3.min(df, function (d) {
          return d.value1
        }) - 1,
        d3.max(df, function (d) {
          return d.value1
        }) + 1,
      ])
      .range([0, width])
    svg
      .append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x).ticks(0))
      .selectAll('text')
      .remove()

    var y = d3
      .scaleLinear()
      .domain([
        d3.min(df, function (d) {
          return d.value2
        }) - 1,
        d3.max(df, function (d) {
          return d.value2
        }) + 1,
      ])
      .range([height, 0])
    
      svg
      .append('g')
      .call(d3.axisLeft(y).ticks(0))
      .selectAll('text')
      .remove()

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
      .style('fill', '#555')

    d3.selectAll('svg').on('click', function () {
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
      <svg ref={svgRef} style={{ width: '100%', height: '95%' }}></svg>
      {clicked && (
        <div
          className="contextMenu"
          style={{ position: 'absolute', left: X, top: Y }}
        >
          <div className="contextMenu--option">remove cell</div>
          <div className="contextMenu--separator" />
          <div className="contextMenu--option">remove cluster</div>
        </div>
      )}
    </>
  )
}
export default ScatterChart
